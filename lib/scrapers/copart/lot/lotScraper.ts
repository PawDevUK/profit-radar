import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import response from './AI_HTML_extract/response.json' with { type: 'json' };
import fs from 'fs';
const pageUrl = 'https://www.copart.com/lot/99763515/salvage-2017-subaru-wrx-dc-washington-dc';
const options = {
	headless: false,
	args: ['--no-sandbox', '--disable-setuid-sandbox'],
};
const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

(async function launch(options) {
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(pageUrl, pageOptions);
	console.log('Launching page:', pageUrl);
	await page.content();

	let lotObj = {};
	let count = 0;
	let failedScraped = 0;
	for (const field of Object.values(response.fields)) {
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
	fs.writeFileSync(
		'results.json',
		JSON.stringify(
			{
				...lotObj,
				Images: convertedImage,
			},
			null,
			2,
		),
	);
	console.log('Finalising and closing');
	await browser.close();
	console.log('----Scrapper closed!----');
})(options);
