import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import scraperHTMLtags from './AI_HTML_extract/AIresponse.json' with { type: 'json' };
import _ from 'lodash';
const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeLot(pageUrls: string[] | string) {
	async function getData(pageUrls: string) {
		await page.goto(pageUrls, pageOptions);
		console.log('Launching page:', pageUrls);
		await page.content();
		let lotObj = {};
		let Success = 0;
		let failedScraped = 0;
		const failedSelectors = [];

		for (const field of Object.values(scraperHTMLtags.fields)) {
			if (field.selector) {
				try {
					Success += 1;
					await page.waitForSelector(field.selector, { timeout: 1000 });
					const value = await page.$eval(field.selector, (el) => el.textContent?.trim() ?? '');
					const label = field.label || '';
					const camelCaseLabel = _.camelCase(label);
					if (field.label !== 'Images') {
						lotObj = { ...lotObj, [camelCaseLabel]: value };
					}
				} catch {
					// selector not present within 1 second, skip to next field
					failedScraped += 1;
					failedSelectors.push(field.selector);
					continue;
				}
			} else if (!field.selector) {
				failedScraped += 1;
			}
		}
		console.log('Scrapped', Success, 'elements.');
		console.log('Failed', failedScraped, 'elements.');
		console.log('Finished scrapping info!!');
		console.log('Starting scrapping images.');
		// extract image URLs
		const imageUrls = await page.$$eval('.img-responsive.p-galleria-img-thumbnail', (images) => images.map((img) => img.getAttribute('src') || '').filter(Boolean));
		if (imageUrls.length > 0) {
			console.log('Image URLs extracted successfully');
		}
		const convertedImage = convertLotImgURL(imageUrls);

		return {
			scrapedLotObj: {
				...lotObj,
				Images: convertedImage,
			},
			scrapingInfo: {
				Success,
				Failed: failedScraped,
				failedSelectors,
				Url: pageUrls,
			},
		};
	}
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	const scrapedData = [];
	if (pageUrls && typeof pageUrls === 'string') {
		const pageUrl = pageUrls;
		const Data = await getData(pageUrl);
		scrapedData.push(Data);
	} else if (Array.isArray(pageUrls)) {
		console.log('Number of Urls to scrape -- >', pageUrls.length);
		for (const url of pageUrls) {
			const Data = await getData(url);
			scrapedData.push(Data);
		}
	}

	console.log('Finalising and closing');
	await browser.close();
	console.log('----Scrapper closed!----');
	return scrapedData;
}
