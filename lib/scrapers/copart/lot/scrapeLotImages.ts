import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import _ from 'lodash';

interface scrapeImagesType {
	lotInv: string | null;
	images: {
		copart: string[] | null;
		AiRepaired: Buffer[] | null;
	};
}

export const createEmptyLotDetails = (): scrapeImagesType => ({
	lotInv: null,
	images: {
		copart: [],
		AiRepaired: [],
	},
});

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeLotImages(pageUrls: string[] | string) {
	async function getData(pageUrls: string) {
		await page.goto(pageUrls, pageOptions);
		console.log('Launching page:', pageUrls);
		await page.content();
		const lotObj = createEmptyLotDetails();
		await page.waitForSelector('.img-responsive.p-galleria-img-thumbnail', { timeout: 1000 });
		console.log('Starting scrapping images.');
		// extract image URLs
		const imageUrls = await page.$$eval('.img-responsive.p-galleria-img-thumbnail', (images) => images.map((img) => img.getAttribute('src') || '').filter(Boolean));
		if (imageUrls.length > 0) {
			console.log('Image URLs extracted successfully', imageUrls.length);
		} else if (imageUrls.length === 0) {
			console.log('No images urls found.');
		}
		lotObj.images = {
			copart: convertLotImgURL(imageUrls),
			AiRepaired: null,
		};

		console.log('------------------');
		console.log('Scraped lot', lotObj.lotInv);
		console.log('------------------');
		return lotObj;
	}
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	const scrapedData = [];
	let numberOfScraped = 0;
	if (pageUrls && typeof pageUrls === 'string') {
		const pageUrl = pageUrls;
		const Data = await getData(pageUrl);
		scrapedData.push(Data);
	} else if (Array.isArray(pageUrls)) {
		console.log('Number of Urls to scrape -- >', pageUrls.length);
		for (const url of pageUrls) {
			const Data = await getData(url);
			scrapedData.push(Data);
			numberOfScraped += 1;
			console.log('Number of scraped cars', numberOfScraped);
		}
	}

	console.log('Finalising and closing');
	await browser.close();
	console.log('----Scrapper closed!----');
	return scrapedData;
}
