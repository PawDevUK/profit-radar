import 'dotenv/config';
const copartCalendarUrl = 'https://www.copart.com/salesListResult?intcmp=banners_auction-calendar_rentals_promotion';
import puppeteer, { type GoToOptions } from 'puppeteer';
import { CalendarMonthType, createEmptyCalendarList } from '@/lib/types/calendar-type';
import fs from 'fs';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export async function scrapeCopartCalendar() {
	const scrapedCalendarMonth: CalendarMonthType = createEmptyCalendarList();
	const options = {
		headless: false, // set to true in production
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	try {
		console.log('Launching Copart calendar page:', copartCalendarUrl);
		await page.goto(copartCalendarUrl, pageOptions);

		// Wait for at least one sale time element to appear
		await page.waitForSelector('[data-uname="saleslistSaletimeval"]', {
			timeout: 15000,
			visible: true,
		});

		// This runs entirely in the browser context → safe from __name error
		const data = await page.$$eval('tr.odd', (els) => {
			return els.map((el) => {
				const qText = (uname: string) => el.querySelector(`[data-uname="${uname}"]`)?.textContent?.trim() ?? null;

				const qHref = (uname: string) => (el.querySelector(`[data-uname="${uname}"] a`) as HTMLAnchorElement | null)?.href ?? null;

				const totalLotsRaw = qText('saleslistTotallotsval');
				const totalLotsParsed = totalLotsRaw ? Number(totalLotsRaw.replace(/[^\d.]/g, '')) : NaN;

				return {
					saleTime: qText('saleslistSaletimeval'),
					saleName: qText('saleslistLocationval'),
					saleType: qText('saleslistRegionval'),
					currentSale: qText('saleslistCurrentsaleval'),
					currentSaleUrl: qHref('saleslistCurrentsaleval'),
					nextSale: qText('saleslistNextsaleval'),
					nextSaleUrl: qHref('saleslistNextsaleval'),
					totalLots: Number.isFinite(totalLotsParsed) ? totalLotsParsed : null,
					lotList: [],
					buyItNow: null,
					scrapedAt: new Date().toISOString(),
				};
			});
		});

		console.log(`Scraped ${data.length} rows`);

		// Save to file
		await fs.promises.writeFile('./scrapedMonth.json', JSON.stringify((scrapedCalendarMonth.auctions = data), null, 2), 'utf8');
		console.log('File written successfully!');

		// Update your calendar object if needed
		// scrapedCalendarMonth.auctions = data;   // uncomment and adjust property name if needed

		return scrapedCalendarMonth;
	} catch (e) {
		console.error('Scraping error:', e);
		// Optionally return error info
		return createEmptyCalendarList(); // or throw e;
	} finally {
		await page.close();
		await browser.close();
	}
}

// Run it
const scrapedMonth = await scrapeCopartCalendar();
