import 'dotenv/config';
const copartCalendarUrl = 'https://www.copart.com/salesListResult';
import puppeteer, { type GoToOptions } from 'puppeteer';
import { CalendarType, createEmptyCalendarList } from '@/lib/types/calendar-type';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeCopartCalendar() {
	const scrapedCalendarMonth: CalendarType = createEmptyCalendarList();
	const options = {
		headless: false, // set to true in production
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	try {
		console.log('Launching Copart calendar page:', copartCalendarUrl);
		await page.goto(copartCalendarUrl, pageOptions);
		await page.waitForSelector('[data-uname="saleslistSaletimeval"]', {
			timeout: 10000,
			visible: true,
		});

		const data = await page.$$eval('tr.odd, tr.even', (els) => {
			return els
				.map((el) => {
					return {
						saleTime: el.querySelector('[data-uname="saleslistSaletimeval"]')?.textContent?.trim() || '',
						saleName: el.querySelector('[data-uname="saleslistLocationval"]')?.textContent?.trim() ?? null,
						saleType: el.querySelector('[access-value="showSalesType"]')?.textContent?.trim() ?? null,
						currentSale: el.querySelector('[data-uname="saleslistCurrentsaleval"]')?.textContent?.trim() ?? null,
						currentSaleUrl: (el.querySelector('[data-uname="saleslistCurrentsaleval"]') as HTMLAnchorElement | null)?.href ?? null,
						nextSale: el.querySelector('[data-uname="saleslistNextsaleval"]')?.textContent?.trim() ?? null,
						nextSaleUrl: (el.querySelector('[data-uname="saleslistNextsaleval"]') as HTMLAnchorElement | null)?.href ?? null,
						numOfLots: null,
						saleId: null,
						buyItNow: null,
						scrapedAt: new Date().toISOString(),
					};
				})
				.filter((item): item is NonNullable<typeof item> => item !== null);
		});

		console.log(`Scraped ${data.length} rows`);
		scrapedCalendarMonth.auctions = data;
		scrapedCalendarMonth.scrapedAt = new Date();
		scrapedCalendarMonth.totalAuctions = data.length;
		return scrapedCalendarMonth;
	} catch (e) {
		console.error('Scraping error:', e);

		return createEmptyCalendarList();
	} finally {
		await page.close();
		await browser.close();
	}
}
