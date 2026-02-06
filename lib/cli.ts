#!/usr/bin/env tsx
import 'dotenv/config';
import { scrapeCopartCalendar } from './scrapers/copart/calendar/calendarScraper.mjs';
import { CopartSaleListScraper } from './scrapers/copart/saleList/saleListScraper.mjs';
import { saveCalendarMonth, getCalendarMonth, incrementalAttachSaleListByLink } from './db/db';

function getMonthName(d: Date) {
	return d.toLocaleString('en-US', { month: 'long' });
}

function parseSaleDateToDate(saleDate: string): Date | null {
	if (!saleDate) return null;
	// epoch ms
	if (/^\d{10,}$/.test(saleDate)) {
		const d = new Date(parseInt(saleDate, 10));
		return isNaN(d.getTime()) ? null : d;
	}
	// ISO or common date strings
	const d = new Date(saleDate);
	return isNaN(d.getTime()) ? null : d;
}

function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

async function taskCalendar() {
	const now = new Date();
	const monthName = getMonthName(now);
	console.log(`\n== Scraping Copart calendar for ${monthName} ==`);
	const auctions = await scrapeCopartCalendar(monthName, { headless: true });
	const res = await saveCalendarMonth(monthName, auctions);
	console.log(`Saved calendar to DB: ${res.month} ${res.year}, ${res.total} auctions`);
}

async function taskSales({ onlyToday = true }: { onlyToday?: boolean } = {}) {
	const now = new Date();
	const monthName = getMonthName(now);
	const year = now.getFullYear();

	console.log(`\n== Loading calendar ${monthName} ${year} for sale list scrape ==`);
	let calendar = await getCalendarMonth(monthName, year);
	if (!calendar) {
		console.log('Calendar not found in DB, scraping it first...');
		const auctions = await scrapeCopartCalendar(monthName, { headless: true });
		await saveCalendarMonth(monthName, auctions);
		calendar = await getCalendarMonth(monthName, year);
	}

	if (!calendar || !Array.isArray(calendar.auctions) || calendar.auctions.length === 0) {
		console.log('No auctions available for sale list scraping.');
		return;
	}

	const targets = calendar.auctions.filter((a: any) => {
		const d = parseSaleDateToDate(String(a.saleDate || ''));
		if (!d) return false;
		return onlyToday ? isSameDay(d, now) : d >= now; // upcoming or today
	});

	console.log(`Found ${targets.length} auction(s) to update sale lists`);

	for (const auction of targets) {
		const link: string = auction.viewSalesLink;
		console.log(`\n-- Scraping sale list: ${auction.location} (${auction.saleDate})`);
		const scraper = new CopartSaleListScraper({ headless: true });
		try {
			await scraper.initialize();
			const cars = await scraper.scrapeSaleList(link, { limit: null });
			const modified = await incrementalAttachSaleListByLink(link, cars);
			console.log(`Updated sale list in DB: ${modified} record(s) changed`);
		} catch (e: any) {
			console.error('Sale list scrape failed:', e?.message || e);
		} finally {
			if (scraper.browser) {
				await scraper.browser.close();
			}
		}
	}
}

async function main() {
	const args = process.argv.slice(2);
	const idx = args.indexOf('--task');
	const task = idx >= 0 ? args[idx + 1] : 'all';

	switch (task) {
		case 'calendar':
			await taskCalendar();
			break;
		case 'sales':
			await taskSales({ onlyToday: true });
			break;
		case 'all':
		default:
			await taskCalendar();
			await taskSales({ onlyToday: true });
			break;
	}
}

main().catch((err) => {
	console.error('CLI failed:', err);
	process.exit(1);
});
