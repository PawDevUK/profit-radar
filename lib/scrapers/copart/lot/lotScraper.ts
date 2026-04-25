import puppeteer, { type GoToOptions } from 'puppeteer';
import convertLotImgURL from './parseImgUrls.js';
import scraperHTMLtags from './AI_HTML_extract/AIresponse.json' with { type: 'json' };
import _ from 'lodash';
import type { LotDetailsType } from '@/lib/types/lotDetails-type';

type ScrapedLotDetails = {
	[K in keyof LotDetailsType]: LotDetailsType[K] | null;
};

const createEmptyLotDetails = (): ScrapedLotDetails => ({
	title: null,
	year: null,
	make: null,
	model: null,
	trim: null,
	bodyStyle: null,
	runAndDrive: null,
	vin: null,
	lotNumber: null,
	laneItem: null,
	saleName: null,
	location: null,
	engineVerified: null,
	engineVerifiedNote: null,
	engineStatus: null,
	transmissionEngages: null,
	transmissionNote: null,
	titleCode: null,
	vehicleTitleType: null,
	odometer: null,
	odometerUnit: null,
	odometerStatus: null,
	primaryDamage: null,
	cylinders: null,
	color: null,
	hasKey: null,
	engineType: null,
	transmission: null,
	vehicleType: null,
	driveTrain: null,
	fuelType: null,
	saleDate: null,
	highlights: null,
	notes: null,
	lastUpdated: null,
	currentBid: null,
	buyItNow: null,
	auctionName: null,
	auctionCountdown: null,
	images: {
		copart: [],
		AiRepaired: [],
	},
	copartLink: null,
});

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeLot(pageUrls: string[] | string) {
	async function getData(pageUrls: string) {
		await page.goto(pageUrls, pageOptions);
		console.log('Launching page:', pageUrls);
		await page.content();
		const lotObj = createEmptyLotDetails();
		const mutableLotObj = lotObj as Record<string, unknown>;
		let Success = 0;
		let failedScraped = 0;
		const failedSelectors: string[] = [];

		for (const field of Object.values(scraperHTMLtags.fields)) {
			if (field.selector) {
				try {
					await page.waitForSelector(field.selector, { timeout: 1000 });
					const value = await page.$eval(field.selector, (el) => el.textContent?.trim() ?? '');
					const label = field.label || '';
					const camelCaseLabel = _.camelCase(label);
					if (field.label !== 'Images' && Object.prototype.hasOwnProperty.call(lotObj, camelCaseLabel)) {
						mutableLotObj[camelCaseLabel] = value;
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
			console.log('Image URLs extracted successfully');
			console.log(imageUrls);
		} else if (imageUrls.length === 0) {
			console.log('No images urls found.');
		}

		lotObj.year = lotObj.title ? lotObj.title?.substring(0, 4).trim() : null;
		lotObj.title = lotObj.title ? lotObj.title.substring(4).trim() : null;

		lotObj.images = {
			copart: convertLotImgURL(imageUrls),
			AiRepaired: null,
		};
		lotObj.copartLink = pageUrls;

		function remove$(key: string) {
			const value = mutableLotObj[key];
			if (typeof value === 'string') {
				mutableLotObj[key] = value.replace('$', '');
			}
		}

		remove$('buyItNow');
		remove$('currentBid');

		if (lotObj.odometer?.includes('km')) {
			lotObj.odometerUnit = 'km';
		} else if (lotObj.odometer?.includes('mi') || lotObj.odometer?.includes('miles')) {
			lotObj.odometerUnit = 'miles';
		}

		if (lotObj.odometer?.includes('Not')) {
			lotObj.odometerStatus = 'Not Actual';
		} else if (lotObj.odometer?.includes('Actual')) {
			lotObj.odometerStatus = 'Actual';
		}

		if (typeof lotObj.odometer === 'string') {
			lotObj.odometer = lotObj.odometer.match(/[\d,]+/)?.[0] ?? null;
		}

		return {
			scrapedLotObj: lotObj,
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
