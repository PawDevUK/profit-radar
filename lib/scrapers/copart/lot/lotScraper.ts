import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import scraperHTMLtags from './AI_HTML_extract/AIresponse.json' with { type: 'json' };
import _ from 'lodash';
import { LotDetailsType, createLotObject } from '@/lib/types/lotDetails-type';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeLot(pageUrls: string[] | string) {
	async function getData(pageUrls: string) {
		const browser = await puppeteer.launch(options);
		const page = await browser.newPage();
		await page.goto(pageUrls, pageOptions);
		console.log('Launching page:', pageUrls);
		await page.content();
		const lotObj = createLotObject();
		// const mutableLotObj = lotObj as Record<string, unknown>;
		let Success = 0;
		let failedScraped = 0;
		const failedSelectors: string[] = [];
		await page.waitForSelector('.img-responsive.p-galleria-img-thumbnail', { timeout: 1000 });

		for (const field of Object.values(scraperHTMLtags.reducedFields)) {
			if (field.selector) {
				try {
					const value = await page.$eval(field.selector, (el) => el.textContent?.trim() ?? '');
					const label = field.label || '';
					const camelCaseLabel = _.camelCase(label) as keyof LotDetailsType;
					if (field.label !== 'Images' && Object.prototype.hasOwnProperty.call(lotObj, camelCaseLabel)) {
						lotObj[camelCaseLabel] = value as never;
						Success += 1;
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
			console.log('Image URLs extracted successfully', imageUrls.length);
		} else if (imageUrls.length === 0) {
			console.log('No images urls found.');
		}

		lotObj.year = lotObj.title ? lotObj.title?.substring(0, 4).trim() : null;
		lotObj.title = lotObj.title ? lotObj.title.substring(4).trim() : null;

		lotObj.images = {
			copart: convertLotImgURL(imageUrls),
			AiRepaired: null,
		};
		lotObj.lotUrl = pageUrls;

		function remove$(key: keyof LotDetailsType) {
			const value = lotObj[key];
			if (typeof value === 'string') {
				lotObj[key] = value.replace('$', '') as never;
			}
		}

		remove$('buyItNow');
		remove$('currentBid');

		if (lotObj.odometer?.includes('km')) {
			lotObj.odometerUnit = 'km' as const;
		} else if (lotObj.odometer?.includes('mi') || lotObj.odometer?.includes('miles')) {
			lotObj.odometerUnit = 'mi' as const;
		}

		if (lotObj.odometer?.includes('Not')) {
			lotObj.odometerDescription = 'Not Actual';
		} else if (lotObj.odometer?.includes('Actual')) {
			lotObj.odometerDescription = 'Actual';
		}

		if (typeof lotObj.odometer === 'string') {
			lotObj.odometer = lotObj.odometer.match(/[\d,]+/)?.[0] ?? null;
		}
		console.log('------------------');
		console.log('Scraped lot', lotObj.lotInv);
		console.log(lotObj.title);
		console.log('------------------');
		await browser.close();
		return lotObj;
	}
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
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
	console.log('----Scrapper closed!----');
	return scrapedData;
}
