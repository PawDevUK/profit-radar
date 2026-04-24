import puppeteer, { Browser, Page, type GoToOptions } from 'puppeteer';
import { proxyConfig, ProxyConfig } from '@/lib/scrapers/proxy/proxy-config';
import scrapeLot from '../lot/lotScraper';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};
export default async function saleListScraper(saleUrl: string, scrapedListSizeNum: number | null) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	if (saleUrl) {
		const browser = await puppeteer.launch(options);
		const salesPage = await browser.newPage();
		await salesPage.goto(saleUrl, pageOptions);
		await salesPage.waitForSelector('a[aria-label="Lot Details"]', { timeout: 30000 });
		const lotUrls = await salesPage.$$eval('a[aria-label="Lot Details"]', (anchors) => anchors.map((a) => (a as HTMLAnchorElement).href).filter(Boolean));
		const scrapedSaleList = await scrapeLot(scrapedListSizeNum ? lotUrls.slice(0, scrapedListSizeNum) : lotUrls);
		await browser.close();
		return scrapedSaleList;
	}
	return 'No sales Urls or list to scrape!!';
}
