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
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	// const context = await createContext();
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.goto(copartCalendarUrl, pageOptions);
	console.log('Launching copart calendar page:', copartCalendarUrl);
	await page.content();

	const scrapedCalendarMonth: CalendarMonthType = createEmptyCalendarList();
	let data = [];
	try {
		await page.waitForSelector('[data-uname="saleslistSaletimeval"]', { timeout: 10000, visible: true });

		data = await page.$$eval('tr.odd', (els) => {
			// const parser = new DOMParser();
			// const doc = parser.parseFromString(els.outerHTML.trim(), 'text/html');
			return els.map((el) => {
				return el.outerHTML.trim();
			});
			// 	els.map((row) => {
			// 		const qText = (uname: string) => row.querySelector(`[data-uname="${uname}"]`)?.textContent?.trim() ?? null;
			// 		const qHref = (uname: string) => (row.querySelector(`[data-uname="${uname}"] a`) as HTMLAnchorElement | null)?.href ?? null;
			// 		const totalLotsRaw = qText('saleslistTotallotsval');
			// 		const totalLotsParsed = totalLotsRaw ? Number(totalLotsRaw.replace(/[^\d.]/g, '')) : NaN;
			// 		return {
			// 			saleTime: qText('saleslistSaletimeval'),
			// 			saleName: qText('saleslistLocationval'),
			// 			saleType: qText('saleslistRegionval'),
			// 			currentSale: qText('saleslistCurrentsaleval'),
			// 			currentSaleUrl: qHref('saleslistCurrentsaleval'),
			// 			nextSale: qText('saleslistNextsaleval'),
			// 			nextSaleUrl: qHref('saleslistNextsaleval'),
			// 			totalLots: Number.isFinite(totalLotsParsed) ? totalLotsParsed : null,
			// 			lotList: [],
			// 			buyItNow: null,
			// 			scrapedAt: new Date().toISOString(),
			// 		};
			// 	}),
		});

		// scrapedCalendarMonth.auctions = rows; // adjust to your actual property name/type
	} catch (e) {
		console.log(e);
	} finally {
		await page.close();
		await browser.close();
	}

	fs.writeFile('./scrapedMonth.html', data.join('\n'), 'utf8', (err) => {
		if (err) {
			console.error('Error writing file:', err);
			return;
		}
		console.log('File written successfully!');
	});
	return scrapedCalendarMonth;
}

const scrapedMonth = await scrapeCopartCalendar();
