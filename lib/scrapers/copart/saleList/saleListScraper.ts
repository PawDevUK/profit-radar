import fs from 'fs';
import puppeteer, { Browser, Page, type GoToOptions } from 'puppeteer';
// Update the import path below to the correct relative path if needed
import { proxyConfig, ProxyConfig } from '@/lib/scrapers/proxy/proxy-config';
import scrapeLot from '../lot/lotScraper';

const salesListUrl =
	'https://www.copart.com/saleListResult/10/2026-04-16?location=CA%20-%20Los%20Angeles&saleDate=1776366000000&liveAuction=false&from=%2FsalesListResult&yardNum=10&qId=1a813ad6-7f82-46c2-bf32-efdc71e1a1f1-1776157018819';
const scrapedListSizeNum = 5;
const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};
export default async function saleListScraper() {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	const browser = await puppeteer.launch(options);
	const salesPage = await browser.newPage();
	await salesPage.goto(salesListUrl, pageOptions);
	await salesPage.waitForSelector('a[aria-label="Lot Details"]', { timeout: 30000 });

	const lotUrls = await salesPage.$$eval('a[aria-label="Lot Details"]', (anchors) => anchors.map((a) => (a as HTMLAnchorElement).href).filter(Boolean));
	const reducedNumOfUrls = lotUrls.slice(0, scrapedListSizeNum);
	console.log('Found lot URLs:', reducedNumOfUrls);

	const scrapedSaleList = await scrapeLot(reducedNumOfUrls);
	fs.writeFile('./scrapedSaleList.json', JSON.stringify(scrapedSaleList), 'utf-8', (err) => {
		if (err) console.error('Error writing file:', err);
	});
}

saleListScraper();
// I need to set puppeteer to get nested url form nested element
// p-d-flex p-flex-column ng-star-inserted
// ng-star-inserted
// <a> aria-label="Lot Details"
