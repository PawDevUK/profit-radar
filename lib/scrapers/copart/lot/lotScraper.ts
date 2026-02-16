import type { Page } from 'puppeteer';

export type CopartLot = {
	url: string;
	lotNumber?: string;
	title?: string;
	vin?: string;
	make?: string;
	model?: string;
	year?: number;
	location?: string;
	saleDate?: string;
	currentBid?: string;
	images?: string[];
};

export async function scrapeLot(page: Page, lotUrl: string): Promise<CopartLot> {
	await page.goto(lotUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
	// Give client-side scripts a moment
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const lot = await page.evaluate(() => {
		const getText = (sel: string) => document.querySelector(sel)?.textContent?.trim() || undefined;
		const getAttr = (sel: string, attr: string) => document.querySelector(sel)?.getAttribute(attr) || undefined;

		const images = Array.from(document.querySelectorAll('img[src*="copart"]'))
			.map((i) => i.getAttribute('src'))
			.filter(Boolean) as string[];

		const title = getText('h1, h2');
		const lotNumber = getText('[data-testid*="lot-number"], .lot-number, [class*="lotNumber"]') || getText('span:has(> b:contains("Lot"))');
		const vin = getText('[data-testid*="vin"], .vin, [class*="vin"]');
		const makeModelYear = getText('[data-testid*="vehicle-title"], .vehicle-title') || title;

		let make: string | undefined;
		let model: string | undefined;
		let year: number | undefined;
		if (makeModelYear) {
			const m = makeModelYear.match(/(\d{4})\s+([A-Za-z0-9\-]+)\s+(.*)/);
			if (m) {
				year = parseInt(m[1], 10);
				make = m[2];
				model = m[3];
			}
		}

		const location = getText('[data-testid*="location"], .location, [class*="location"]');
		const saleDate = getText('[data-testid*="sale-date"], .sale-date, [class*="saleDate"]');
		const currentBid = getText('[data-testid*="current-bid"], .current-bid, [class*="bid"]');

		return { title, lotNumber, vin, make, model, year, location, saleDate, currentBid, images };
	});

	return { url: lotUrl, ...lot };
}
