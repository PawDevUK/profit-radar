import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import scraperHTMLtags from './AI_HTML_extract/AIresponse.json' with { type: 'json' };
const pageUrl = 'https://www.copart.com/lot/99763515/salvage-2017-subaru-wrx-dc-washington-dc';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeLot(pageUrl: string) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(pageUrl, pageOptions);
	console.log('Launching page:', pageUrl);
	await page.content();

	let lotObj = {};
	let count = 0;
	let failedScraped = 0;
	for (const field of Object.values(scraperHTMLtags.fields)) {
		if (field.selector) {
			count += 1;
			await page.waitForSelector(field.selector);
			const value = await page.$eval(field.selector, (el) => el.textContent?.trim() ?? '');
			const label = field.label || '';
			lotObj = { ...lotObj, [label]: value };
			if (field.label !== 'Images') {
				lotObj = { ...lotObj, [label]: value };
			}
		} else if (!field.selector) {
			failedScraped += 1;
		}
	}
	console.log('Scrapped', count, 'elements.');
	console.log('Failed', failedScraped, 'elements.');
	console.log('Finished scrapping info!!');
	console.log('Starting scrapping images.');

	// extract image URLs
	const imageUrls = await page.$$eval('.img-responsive.p-galleria-img-thumbnail', (images) => images.map((img) => img.getAttribute('src') || '').filter(Boolean));
	if (imageUrls.length > 0) {
		console.log('Image URLs extracted successfully');
	}
	const convertedImage = convertLotImgURL(imageUrls);
	const scrapedLotObj = {
		...lotObj,
		Images: convertedImage,
	};
	console.log('Finalising and closing');
	await browser.close();
	console.log('----Scrapper closed!----');
	return scrapedLotObj;
}
