import 'dotenv/config';
const copartCalendarUrl = 'https://www.copart.com/salesListResult?intcmp=banners_auction-calendar_rentals_promotion';
import puppeteer, { type GoToOptions } from 'puppeteer';
import { CalendarMonthType, createEmptyCalendarList } from '@/lib/types/calendar-type';
import { connectDB } from '@/lib/db/db';
import MonthSaleModel from '@/lib/db/models';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

export default async function scrapeCopartCalendar() {
	const scrapedCalendarMonth: CalendarMonthType = createEmptyCalendarList();
	const options = {
		headless: false, // set to true in production
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	try {
		console.log('Launching Copart calendar page:', copartCalendarUrl);
		await page.goto(copartCalendarUrl, pageOptions);
		await page.waitForSelector('[data-uname="saleslistSaletimeval"]', {
			timeout: 15000,
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
						lotList: [],
						buyItNow: null,
						scrapedAt: new Date().toISOString(),
					};
				})
				.filter((item): item is NonNullable<typeof item> => item !== null);
		});

		console.log(`Scraped ${data.length} rows`);
		scrapedCalendarMonth.auctions = data;
		scrapedCalendarMonth.year = new Date().getFullYear();
		scrapedCalendarMonth.month = months[new Date().getMonth()];
		scrapedCalendarMonth.scrapedAt = new Date();
		scrapedCalendarMonth.totalAuctions = data.length;

		if (scrapedCalendarMonth && scrapedCalendarMonth.totalAuctions > 1) {
			await connectDB();
			const monthSaleList = new MonthSaleModel(scrapedCalendarMonth);
			await monthSaleList.save();
			console.log('Month sale data saved to database successfully!');
		} else {
			console.log('Not enough auctions scraped, skipping save.');
		}
		// await fs.promises.writeFile('./scrapedMonth.json', JSON.stringify(scrapedCalendarMonth, null, 2), 'utf8');
		// console.log('File written successfully!');
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
