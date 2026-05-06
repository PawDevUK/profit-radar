import { getAllLots, connectDB } from '@/lib/db/db';
import { NextResponse } from 'next/server';
import { LotDetailsModel } from '@/lib/db/models';
import mongoose from 'mongoose';

import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from '@/lib/scrapers/copart/lot/parseImgUrls';
import _ from 'lodash';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};
export async function GET() {
	const allLots = await getAllLots();
	const lots = allLots.map((doc) => doc.toObject());
	let message;

	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 800 });
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

	for (const lot of lots) {
		if (!lot.images.copart || lot.images.copart.length === 0) {
			// scraper
			const lotUrl = lot.lotUrl;
			let scrapedImages: string[] = [];

			if (lotUrl) {
				await page.goto(lotUrl, pageOptions);
				console.log('Launching page:', lotUrl);
				await page.content();
				const consentSelector = 'button[aria-label="Consent"].fc-button.fc-cta-consent.fc-primary-button';
				const consentButton = await page.$(consentSelector);
				if (consentButton) {
					await page.click(consentSelector);
				}
				await page.waitForSelector('.img-responsive.p-galleria-img-thumbnail', { timeout: 20000 });
				console.log('Starting scrapping images.');
				// extract image URLs
				const imageUrls = await page.$$eval('.img-responsive.p-galleria-img-thumbnail', (images) => images.map((img) => img.getAttribute('src') || '').filter(Boolean));
				if (imageUrls.length > 0) {
					console.log('Image URLs extracted successfully', imageUrls.length);
				} else if (imageUrls.length === 0) {
					console.log('No images urls found.');
				}
				scrapedImages = convertLotImgURL(imageUrls) || [];
			}

			// Database insertion
			if (scrapedImages.length > 0) {
				await connectDB();
				const result = await LotDetailsModel.findOneAndUpdate({ _id: lot._id }, { $set: { 'images.copart': scrapedImages } }, { upsert: false, new: true });
				if (result) {
					console.log('Saved lot', lot._id, '| images:', result.images?.copart?.length);
				} else {
					console.log('No document matched _id:', lot._id, '— nothing updated');
				}
			} else {
				message = 'There are not images urls scraped!';
				console.log(message);
			}
		}
	}
	console.log('Finalising and closing');
	await browser.close();
	console.log('----Scrapper closed!----');

	return NextResponse.json({
		message,
	});
}
