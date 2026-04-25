import puppeteer, { Browser, Page, type GoToOptions } from 'puppeteer';
import { createContext } from '@/lib/scrapers/proxy/createContext';
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
	let browser: { close: () => Promise<void> } | null = null;
	try {
		if (saleUrl) {
			const ctx = await createContext(options);
			browser = ctx.browser;
			const salesPage = ctx.page;
			await salesPage.goto(saleUrl, pageOptions);
			await salesPage.waitForSelector('a[aria-label="Lot Details"]', { timeout: 30000 });
			const lotUrls = await salesPage.$$eval('a[aria-label="Lot Details"]', (anchors) => anchors.map((a) => (a as HTMLAnchorElement).href).filter(Boolean));
			const scrapedSaleList = await scrapeLot(scrapedListSizeNum ? lotUrls.slice(0, scrapedListSizeNum) : lotUrls);
			return scrapedSaleList;
		}
	} catch (e) {
		console.log(e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
