// @ts-nocheck

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { type Browser, type Page } from 'puppeteer';
import { fileURLToPath } from 'url';

// Add stealth plugin to puppeteer
puppeteer.use(StealthPlugin());

type HeadlessOption = boolean | 'new';

// Helper function for delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function for random delays (more human-like)
const randomDelay = (min: number, max: number) => {
	const ms = Math.floor(Math.random() * (max - min + 1)) + min;
	return delay(ms);
};

type CopartScraperConfig = {
	headless?: HeadlessOption;
	timeout?: number;
	fastStart?: boolean;
	proxy?: {
		server: string; // e.g., 'http://proxy.example.com:8080'
		username?: string;
		password?: string;
	};
};

/**
 * CopartScraper - Independent scraper engine for Copart auction site
 * Handles all Copart-specific scraping logic and browser automation
 */
export class CopartScraper {
	private browser!: Browser;
	private page!: Page;
	private headless: HeadlessOption;
	private timeout: number;
	private results: any[];
	private proxy?: { server: string; username?: string; password?: string };
	private fastStart: boolean;

	constructor(config: CopartScraperConfig = {}) {
		this.headless = config.headless !== undefined ? config.headless : 'new';
		this.timeout = config.timeout || 60000;
		this.results = [];
		this.proxy = config.proxy;
		this.fastStart = !!config.fastStart;
	}

	async initialize() {
		if (this.proxy) {
			console.log(`Launching browser with proxy: ${this.proxy.server}`);
		} else {
			console.log('Launching browser...');
		}

		const launchArgs = [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-blink-features=AutomationControlled',
			'--disable-web-resources',
			'--disable-extensions',
			'--disable-features=IsolateOrigins,site-per-process',
			'--disable-site-isolation-trials',
			'--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
		];

		// Add proxy args if configured
		if (this.proxy) {
			launchArgs.push(`--proxy-server=${this.proxy.server}`);
		}

		this.browser = await puppeteer.launch({
			headless: this.headless,
			args: launchArgs,
		});
		this.page = await this.browser.newPage();

		// Authenticate proxy if credentials provided
		if (this.proxy?.username && this.proxy?.password) {
			await this.page.authenticate({
				username: this.proxy.username,
				password: this.proxy.password,
			});
			console.log('  ✓ Proxy authentication configured');
		}

		// Random realistic viewport
		const viewports = [
			{ width: 1920, height: 1080 },
			{ width: 1366, height: 768 },
			{ width: 1536, height: 864 },
			{ width: 1440, height: 900 },
		];
		const viewport = viewports[Math.floor(Math.random() * viewports.length)];
		await this.page.setViewport(viewport);

		// Set more realistic headers to avoid bot detection
		await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

		// Additional anti-detection measures
		await this.page.evaluateOnNewDocument(() => {
			// Hide webdriver
			Object.defineProperty(navigator, 'webdriver', {
				get: () => false,
			});

			// Spoof plugins
			Object.defineProperty(navigator, 'plugins', {
				get: () => [1, 2, 3, 4, 5],
			});

			// Spoof languages
			Object.defineProperty(navigator, 'languages', {
				get: () => ['en-US', 'en'],
			});

			// Spoof chrome object
			(window as any).chrome = {
				runtime: {},
			};

			// Override permissions
			const originalQuery = window.navigator.permissions.query;
			window.navigator.permissions.query = (parameters: any) =>
				parameters.name === 'notifications' ? Promise.resolve({ state: 'denied' } as PermissionStatus) : originalQuery(parameters);
		});

		// Set headers
		await this.page.setExtraHTTPHeaders({
			'Accept-Language': 'en-US,en;q=0.9',
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, br',
			'Sec-Fetch-Dest': 'document',
			'Sec-Fetch-Mode': 'navigate',
			'Sec-Fetch-Site': 'none',
			'Sec-Fetch-User': '?1',
			'Upgrade-Insecure-Requests': '1',
			'Cache-Control': 'max-age=0',
		});
	}

	/**
	 * Check if CAPTCHA is present and wait for user to solve it
	 */
	async checkAndWaitForCaptcha(timeoutSeconds: number = 120): Promise<boolean> {
		const hasCaptcha = await this.page.evaluate(() => {
			return !!(
				document.querySelector('iframe[src*="captcha"]') ||
				document.querySelector('iframe[src*="recaptcha"]') ||
				document.querySelector('.g-recaptcha') ||
				document.querySelector('#captcha') ||
				document.querySelector('[class*="captcha"]') ||
				document.body.innerText.includes('verify you are human') ||
				document.body.innerText.includes('CAPTCHA') ||
				document.body.innerText.includes('security check')
			);
		});

		if (hasCaptcha) {
			console.log('\n⚠️  CAPTCHA DETECTED! ⚠️');
			console.log(`⏳ Waiting up to ${timeoutSeconds} seconds for you to solve it...`);
			console.log('   Please solve the CAPTCHA in the browser window\n');

			// Wait for CAPTCHA to be solved (check every 2 seconds)
			const maxAttempts = timeoutSeconds / 2;
			for (let i = 0; i < maxAttempts; i++) {
				await randomDelay(2000, 2500);

				const stillHasCaptcha = await this.page.evaluate(() => {
					return !!(
						document.querySelector('iframe[src*="captcha"]') ||
						document.querySelector('iframe[src*="recaptcha"]') ||
						document.querySelector('.g-recaptcha') ||
						document.querySelector('#captcha') ||
						document.querySelector('[class*="captcha"]')
					);
				});

				if (!stillHasCaptcha) {
					console.log('✅ CAPTCHA solved! Continuing...\n');
					await randomDelay(1000, 2000); // Extra delay after CAPTCHA
					return true;
				}

				// Show progress every 10 seconds
				if ((i + 1) % 5 === 0) {
					console.log(`   Still waiting... (${(i + 1) * 2}s elapsed)`);
				}
			}

			console.log('❌ CAPTCHA timeout - please solve it faster next time\n');
			return false;
		}

		return true; // No CAPTCHA found
	}

	/**
	 * Scrape today's auctions from Copart
	 */
	async scrapeTodaysAuctions() {
		console.log("Copart: Scraping today's auctions...");
		console.log("Navigating to Copart Today's Auctions...");
		await this.page.goto('https://www.copart.com/todaysAuction', {
			waitUntil: 'domcontentloaded',
			timeout: this.timeout,
		});

		console.log('Page loaded, waiting for content...');
		await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 }).catch(() => {});

		const auctions = await this.page.evaluate(() => {
			const auctionList = [];
			const tableRows = document.querySelectorAll('tbody tr');

			tableRows.forEach((element) => {
				try {
					const cells = element.querySelectorAll('td');
					if (cells.length < 2) return;

					const allText = Array.from(cells).map((c) => c.textContent?.trim() || '');
					let location = allText.find((text) => text.length > 10 && !text.includes('GMT') && !text.includes(':')) || allText[0] || '';
					location = location.replace(/\s+/g, ' ').trim();

					const link = element.querySelector('a');
					const viewSalesLink = link?.href || '';

					if (location && location.length > 3 && viewSalesLink) {
						auctionList.push({
							location,
							saleType: allText[1] || '',
							saleDate: allText[2] || '',
							saleTime: allText[3] || '',
							viewSalesLink,
							cars: [],
						});
					}
				} catch (e) {
					// Skip errors
				}
			});

			return auctionList;
		});

		console.log(`Found ${auctions.length} auctions`);
		return auctions;
	}

	/**
	 * Scrape auctions from calendar for a specific month
	 */
	async scrapeCalendarAuctions(targetMonth: string = 'January'): Promise<any[]> {
		console.log(`Navigating to Copart auction calendar (month: ${targetMonth})...`);
		await this.page.goto('https://www.copart.com/auctionCalendar', {
			waitUntil: 'domcontentloaded',
			timeout: this.timeout,
		});

		console.log('Calendar page loaded, waiting for content...');
		await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 }).catch(() => {});

		await this.page.waitForSelector('a[href*="saleListResult"], a[href*="auctionDashboard"]', { timeout: 8000 }).catch(() => {});

		try {
			const html = await this.page.content();
			const snapPath = './results/calendar_snapshot.html';
			fs.mkdirSync('./results', { recursive: true });
			fs.writeFileSync(snapPath, html);
			console.log(`Saved calendar snapshot to ${snapPath}`);
		} catch (e) {
			console.log('Could not save calendar snapshot:', (e as Error).message);
		}

		const auctions = await this.page.evaluate((monthName) => {
			const auctionList = [];
			const normalize = (s = '') => s.replace(/\s+/g, ' ').trim();
			const isMonthMatch = (text: string) => text.toLowerCase().includes(monthName.toLowerCase());

			const monthIndex: { [key: string]: number } = {
				january: 0,
				february: 1,
				march: 2,
				april: 3,
				may: 4,
				june: 5,
				july: 6,
				august: 7,
				september: 8,
				october: 9,
				november: 10,
				december: 11,
			};

			const targetMonthIndex = monthIndex[monthName.toLowerCase()] ?? null;

			const isTargetMonthFromMs = (ms: string): boolean => {
				if (!ms) return false;
				const d = new Date(parseInt(ms));
				return !isNaN(d.getTime()) && d.getMonth() === targetMonthIndex;
			};

			const isTargetMonthFromDateStr = (ds: string): boolean => {
				if (!ds) return false;
				const d = new Date(ds);
				return !isNaN(d.getTime()) && d.getMonth() === targetMonthIndex;
			};

			const links = Array.from(document.querySelectorAll('a[href*="saleListResult"], a[href*="auctionDashboard"], a[href*="viewSale"], a[data-url*="saleListResult"]'));
			links.forEach((link) => {
				const text = normalize(link.textContent || '');
				const dataUrl = link.getAttribute('data-url') || '';
				const href = link.getAttribute('href') || '';
				const fullHref = href.startsWith('http') ? href : `https://www.copart.com${href.replace(/^\./, '')}`;

				const urlForDate = dataUrl || href;
				const saleDateMsMatch = urlForDate.match(/saleDate=(\d{10,})/);
				const saleDatePathMatch = urlForDate.match(/saleListResult\/\d+\/(\d{4}-\d{2}-\d{2})/);
				const saleDateMs = saleDateMsMatch ? saleDateMsMatch[1] : '';
				const saleDatePath = saleDatePathMatch ? saleDatePathMatch[1] : '';

				const inMonth = targetMonthIndex === null ? isMonthMatch(text) : isTargetMonthFromMs(saleDateMs) || isTargetMonthFromDateStr(saleDatePath) || isMonthMatch(text);
				if (!inMonth) return;

				const row = link.closest('tr') || link.parentElement;
				const cells = row ? Array.from(row.querySelectorAll('td')).map((c) => normalize(c.textContent || '')) : [];
				const location = cells.find((t) => t.length > 3) || text || link.title || link.getAttribute('aria-label') || '';
				const saleDate = saleDatePath || saleDateMs || cells.find((t) => /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(t)) || text;
				const saleTime = cells.find((t) => /am|pm|\d{1,2}:\d{2}/i.test(t)) || '';
				if (location && link.href) {
					auctionList.push({
						location,
						saleType: cells[1] || '',
						saleDate,
						saleTime,
						viewSalesLink: fullHref,
						cars: [],
					});
				}
			});

			if (auctionList.length === 0) {
				const rowSelectors = ['table tbody tr', 'tbody tr', '.table tbody tr', '[role="row"]'];
				let rows: Element[] = [];
				for (const sel of rowSelectors) {
					rows = Array.from(document.querySelectorAll(sel));
					if (rows.length > 0) break;
				}

				rows.forEach((row) => {
					try {
						const cells = Array.from(row.querySelectorAll('td'));
						if (cells.length === 0) return;

						const cellText = cells.map((c) => normalize(c.textContent || ''));
						const saleDate = cellText.find((t) => /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(t)) || '';
						if (!isMonthMatch(saleDate)) return;

						const location = cellText.find((t) => t.length > 3) || '';
						const linkEl = row.querySelector('a');
						const viewSalesLink = linkEl?.href || '';

						if (location && viewSalesLink) {
							auctionList.push({
								location,
								saleType: cellText[1] || '',
								saleDate,
								saleTime: cellText[3] || '',
								viewSalesLink,
								cars: [],
							});
						}
					} catch (e) {
						// skip row errors
					}
				});
			}

			return auctionList;
		}, targetMonth);

		console.log(`Found ${auctions.length} ${targetMonth} auctions from calendar`);
		return auctions;
	}

	/**
	 * Parse cars from current auction page
	 */
	async parseAuctionCars(): Promise<any[]> {
		return await this.page.evaluate(() => {
			const carList = [];

			// Debug: Check what selectors exist on the page
			const debugInfo = {
				dataLotnumberRows: document.querySelectorAll('tbody tr[data-lotnumber]').length,
				allTableRows: document.querySelectorAll('tbody tr').length,
				lotNumberDataAttrs: document.querySelectorAll('[data-uname*="lotsearchLotimage"]').length,
				divWithLotNum: document.querySelectorAll('div[data-lotnumber]').length,
			};
			console.log('Page structure debug:', debugInfo);

			// Try multiple selectors for finding car rows
			let rows: NodeListOf<Element>;

			// Strategy 1: data-lotnumber on tr
			rows = document.querySelectorAll('tbody tr[data-lotnumber]');

			// Strategy 2: If no rows found, try looking for lot image divs and traverse up
			if (rows.length === 0) {
				console.log('No tr[data-lotnumber] found, trying alternative selectors...');
				rows = document.querySelectorAll('div[data-lotnumber]');
			}

			// Strategy 3: Look for table rows that contain lot numbers in text
			if (rows.length === 0) {
				console.log('No data-lotnumber found, trying text-based detection...');
				const allRows = Array.from(document.querySelectorAll('tbody tr'));
				const filteredRows = allRows.filter((row) => {
					const text = row.textContent || '';
					return text.match(/Lot\s+#?\s*\d+/i) || text.match(/\$\d+/);
				});
				rows = document.querySelectorAll('tbody tr'); // Get all for now
				console.log(`Found ${filteredRows.length} potential car rows`);
			}

			console.log(`Processing ${rows.length} rows...`);

			rows.forEach((row) => {
				try {
					// Get lot number from data attribute
					const lotNumber = (row as HTMLElement).getAttribute('data-lotnumber') || '';

					// Get all cells
					const cells = row.querySelectorAll('td');
					if (cells.length < 2) return;

					// Parse cells - structure is: Image | Lot info | Vehicle info | Condition | Sale info | Bids
					let title = '';
					let year = '';
					let make = '';
					let model = '';
					let odometer = '';
					let price = '';
					let damage = '';
					let location = '';
					let imageUrl = '';

					// Cell 1: Lot info (contains title like "2017 FORD TRANSIT T-150")
					const lotInfoText = cells[1]?.textContent || '';
					// Extract title from "2017 FORD TRANSIT T-150"
					const titleMatch = lotInfoText.match(/(\d{4})\s+([A-Z]+)\s+(.+?)(?:\s+Lot\s+#|$)/i);
					if (titleMatch) {
						year = titleMatch[1];
						make = titleMatch[2];
						model = titleMatch[3].trim();
						title = `${year} ${make} ${model}`.toLowerCase();
					} else {
						title = lotInfoText.split('Lot')[0].trim().toLowerCase();
					}

					// Get image URL from img tag in first cell
					const imgElement = cells[0]?.querySelector('img');
					if (imgElement) {
						imageUrl = imgElement.getAttribute('src') || '';
					}

					// Cell 2: Vehicle info (contains odometer)
					const vehicleInfoText = cells[2]?.textContent || '';
					const odometerMatch = vehicleInfoText.match(/(\d+(?:,\d+)*)\s*(?:mi|km|miles)/i);
					if (odometerMatch) {
						odometer = odometerMatch[1].replace(/,/g, '');
					}

					// Cell 3: Condition (contains damage)
					const conditionText = cells[3]?.textContent || '';
					const damageTypes = [
						'Structural Damage',
						'Door Damage',
						'Water Damage',
						'Fire Damage',
						'Front End',
						'Rear End',
						'Side Damage',
						'Clean Title',
						'Salvage Title',
						'Rebuilt',
						'Minor Dent/Scratches',
					];
					for (const type of damageTypes) {
						if (conditionText.includes(type)) {
							damage = type;
							break;
						}
					}

					// Cell 4: Sale info (contains location)
					const saleInfoText = cells[4]?.textContent || '';
					const locationMatch = saleInfoText.match(/([A-Z]{2})\s*-\s*([A-Z\s]+?)\s*(?:-|$)/);
					if (locationMatch) {
						location = `${locationMatch[1]} - ${locationMatch[2].trim()}`;
					}

					// Cell 5: Bids (contains current bid price)
					const bidsText = cells[5]?.textContent || '';
					const priceMatch = bidsText.match(/\$[\d,]+(?:\.\d{2})?/);
					if (priceMatch) {
						price = priceMatch[0];
					}

					// Get details link from lot info cell
					const detailsLink = cells[1]?.querySelector('a')?.getAttribute('href') || '';
					const fullDetailsLink = detailsLink ? `https://www.copart.com${detailsLink}` : '';

					if (lotNumber || title || price) {
						carList.push({
							lotNumber: lotNumber.trim(),
							title: title.trim(),
							year: year.trim(),
							make: make.trim(),
							model: model.trim(),
							bodyType: '',
							color: '',
							transmission: '',
							odometer: odometer.trim(),
							vin: '',
							price: price.trim(),
							buyItNowPrice: '',
							damage: damage.trim(),
							titleCode: '',
							engineStarts: '',
							transmissionEngages: '',
							hasKey: '',
							highlights: [],
							notes: '',
							imageUrl: imageUrl.trim(),
							images: [imageUrl.trim()].filter((u) => u),
							detailsLink: fullDetailsLink.trim(),
							location: location.trim(),
						});
					}
				} catch (e) {
					// Skip errors
				}
			});

			return carList;
		});
	}

	/**
	 * Scrape auction cars with pagination support
	 */
	async scrapeAuctionCars(auctionUrl: string, carsPerPage: number = 20, limit: number | null = null) {
		console.log(`  Navigating to auction page...`);

		try {
			await this.page.goto(auctionUrl, {
				waitUntil: this.fastStart ? 'domcontentloaded' : 'networkidle0',
				timeout: this.timeout,
			});
		} catch (e) {
			console.log('  Navigation timeout, waiting for page to load...');
			if (this.fastStart) {
				await delay(300);
			} else {
				await randomDelay(3000, 5000);
			}
		}

		// Check for CAPTCHA first
		const captchaSolved = await this.checkAndWaitForCaptcha(this.fastStart ? 45 : 120);
		if (!captchaSolved) {
			console.log('  ❌ CAPTCHA not solved, aborting scrape');
			return [];
		}

		// Simulate human behavior: random mouse movements
		console.log('  Simulating human behavior...');
		await this.page.mouse.move(Math.random() * 500, Math.random() * 500);
		if (this.fastStart) {
			await delay(100);
		} else {
			await randomDelay(400, 800);
		}
		await this.page.mouse.move(Math.random() * 1000, Math.random() * 800);
		if (this.fastStart) {
			await delay(100);
		} else {
			await randomDelay(300, 500);
		}

		// Check for blocking/cloudflare
		const isBlocked = await this.page.evaluate(() => {
			const blockedIndicators = [
				document.body.textContent.includes('Just a moment'),
				document.body.textContent.includes('Checking your browser'),
				document.body.textContent.includes('Access Denied'),
				document.body.textContent.includes('403'),
				document.querySelector('[class*="cloudflare"]') !== null,
			];
			return blockedIndicators.some((x) => x);
		});

		if (isBlocked) {
			console.log('  ⚠️  Possible bot detection/blocking detected. Waiting...');
			if (this.fastStart) {
				await delay(400);
			} else {
				await randomDelay(2000, 3000);
			}
		}

		// Wait for JavaScript to render the car listings
		console.log('  Waiting for page content to render...');
		if (this.fastStart) {
			await delay(500);
		} else {
			await randomDelay(2000, 3000);
		}

		// Simulate human behavior: gradual scrolling to trigger lazy-loaded content
		console.log('  Scrolling to trigger content loading...');
		await this.page.evaluate(async () => {
			// Scroll down gradually
			for (let i = 0; i < 2; i++) {
				window.scrollBy(0, 300);
				await new Promise((resolve) => setTimeout(resolve, 400));
			}
			// Scroll back up
			window.scrollBy(0, -200);
		});
		if (this.fastStart) {
			await delay(200);
		} else {
			await randomDelay(800, 1200);
		}

		// Debug: Check what's actually on the page
		const pageDebug = await this.page.evaluate(() => {
			const tbodyTrs = document.querySelectorAll('tbody tr');
			const dataLotNumbers = document.querySelectorAll('[data-lotnumber]');

			return {
				hasTable: !!document.querySelector('table'),
				hasTbody: !!document.querySelector('tbody'),
				tbodyTrCount: tbodyTrs.length,
				dataLotNumberCount: dataLotNumbers.length,
				bodyTextPreview: document.body.textContent?.substring(0, 300).replace(/\s+/g, ' ').trim(),
				hasAccessDenied: document.body.textContent?.includes('Access Denied') || document.body.textContent?.includes('403'),
				hasCloudflare: !!document.querySelector('[class*="cloudflare"]'),
				hasSecurityCheck: document.body.textContent?.toLowerCase().includes('security check'),
				pageTitle: document.title,
				url: window.location.href,
			};
		});

		console.log('  🔍 Page debug info:');
		console.log(`    - Page title: "${pageDebug.pageTitle}"`);
		console.log(`    - URL: ${pageDebug.url}`);
		console.log(`    - Has table: ${pageDebug.hasTable}`);
		console.log(`    - Has tbody: ${pageDebug.hasTbody}`);
		console.log(`    - tbody tr count: ${pageDebug.tbodyTrCount}`);
		console.log(`    - data-lotnumber count: ${pageDebug.dataLotNumberCount}`);
		console.log(`    - Access Denied: ${pageDebug.hasAccessDenied}`);
		console.log(`    - Cloudflare: ${pageDebug.hasCloudflare}`);
		console.log(`    - Security Check: ${pageDebug.hasSecurityCheck}`);
		console.log(`    - Body preview: "${pageDebug.bodyTextPreview?.substring(0, 120)}..."`);

		// If no car elements found, save the page HTML for debugging
		if (pageDebug.tbodyTrCount === 0 && pageDebug.dataLotNumberCount === 0) {
			console.log('  ⚠️  NO CAR ELEMENTS FOUND - Saving page HTML for debugging...');
			const html = await this.page.content();
			fs.writeFileSync('results/blocked-page-debug.html', html);
			console.log('  📄 Saved HTML to results/blocked-page-debug.html');
		}

		// Try to wait for car listings to appear
		try {
			await this.page.waitForSelector('tbody tr, div[data-lotnumber], table', { timeout: this.fastStart ? 8000 : 15000 });
			console.log('  ✓ Page content loaded');
		} catch (e) {
			console.log('  ⚠️  Could not detect car listings after 15s');
			console.log('  ⚠️  Page may be showing bot detection screen');
			// Take a screenshot for debugging
			try {
				await this.page.screenshot({ path: 'results/blocked-page-debug.png', fullPage: true });
				console.log('  📸 Saved screenshot to results/blocked-page-debug.png');
			} catch (screenshotError) {
				console.log('  ⚠️  Could not save screenshot');
			}
		}

		if (this.fastStart) {
			await delay(300);
		} else {
			await randomDelay(1500, 3000);
		}

		// Try to set cars per page to the specified amount
		const pageSize = await this.page.evaluate((itemsPerPage) => {
			const sizeSelectors = ['select[name*="size"]', 'select[name*="pageSize"]', 'select[name*="per"]', '[data-uname*="pageSize"]', '.items-per-page select'];

			for (const selector of sizeSelectors) {
				const element = document.querySelector(selector);
				if (element) {
					const options = Array.from(element.querySelectorAll('option'));
					const matchingOption = options.find((opt) => parseInt(opt.value) === itemsPerPage || opt.textContent.includes(itemsPerPage.toString()));

					if (matchingOption) {
						element.value = matchingOption.value;
						element.dispatchEvent(new Event('change', { bubbles: true }));
						return itemsPerPage;
					}
				}
			}
			return null;
		}, carsPerPage);

		if (pageSize) {
			console.log(`  Set cars per page to: ${pageSize}`);
			await delay(this.fastStart ? 500 : 2000);
		}

		const allCars = [];
		let pageNumber = 1;
		let hasMorePages = true;
		let maxPages = 999;

		while (hasMorePages && pageNumber <= maxPages) {
			console.log(`  Extracting page ${pageNumber}...`);

			const carsOnPage = await this.parseAuctionCars();

			allCars.push(...carsOnPage);
			console.log(`    Page ${pageNumber}: ${carsOnPage.length} cars`);

			// Debug: If no cars found on first page, take a screenshot
			if (pageNumber === 1 && carsOnPage.length === 0) {
				try {
					const screenshotPath = `./results/debug_no_cars_${Date.now()}.png`;
					await this.page.screenshot({ path: screenshotPath, fullPage: true });
					console.log(`    📸 Screenshot saved to: ${screenshotPath}`);

					// Also log the page HTML structure
					const pageInfo = await this.page.evaluate(() => {
						return {
							url: window.location.href,
							title: document.title,
							bodyText: document.body.innerText.substring(0, 500),
							hasTable: !!document.querySelector('table'),
							hasTbody: !!document.querySelector('tbody'),
							trCount: document.querySelectorAll('tr').length,
						};
					});
					console.log('    Page info:', pageInfo);
				} catch (e) {
					console.log('    Could not capture debug info');
				}
			}

			// Stop if we've reached the limit
			if (limit !== null && allCars.length >= limit) {
				console.log(`  ✓ Reached limit of ${limit} cars`);
				return allCars.slice(0, limit);
			}

			// Try to find and click next button
			const nextButtonFound = await this.page.evaluate(() => {
				const nextButtonSelectors = [
					'a[data-uname="lotsearchPaginationnext"]',
					'button[aria-label="Next Page"]',
					'.pagination a.next:not(.disabled)',
					'a.next-page:not(.disabled)',
					'button.next:not(.disabled)',
					'li.next:not(.disabled) a',
					'a[rel="next"]',
				];

				for (const selector of nextButtonSelectors) {
					const nextButton = document.querySelector(selector);
					if (nextButton && !nextButton.classList.contains('disabled') && !nextButton.hasAttribute('disabled')) {
						nextButton.click();
						return true;
					}
				}
				return false;
			});

			if (nextButtonFound) {
				// Wait for page to load after clicking next button with human-like delay
				console.log(`    Moving to page ${pageNumber + 1}...`);
				if (this.fastStart) {
					await delay(400);
				} else {
					await randomDelay(1000, 1500);
				}

				try {
					await this.page.waitForNavigation({ waitUntil: this.fastStart ? 'domcontentloaded' : 'networkidle2', timeout: this.fastStart ? 3000 : 5000 }).catch(() => {});
				} catch (e) {
					// Navigation might not happen, wait for page update
					if (this.fastStart) {
						await delay(400);
					} else {
						await randomDelay(1000, 1500);
					}
				}
				pageNumber++;
			} else {
				hasMorePages = false;
			}
		}

		if (allCars.length === 0) {
			console.log('\n  ❌ WARNING: Scraped 0 cars!');
			console.log('  This usually means Copart is blocking the scraper.');
			console.log('  Please check:');
			console.log('    1. results/blocked-page-debug.html - the actual HTML served');
			console.log('    2. results/blocked-page-debug.png - screenshot of the page');
			console.log('    3. The browser window to see what page was displayed');
			console.log('  Common causes:');
			console.log('    - Bot detection (elements hidden from scrapers)');
			console.log('    - CAPTCHA not detected by our checker');
			console.log('    - Cloudflare security challenge');
			console.log('    - IP address blocked/rate limited\n');
		} else {
			console.log(`  ✅ Successfully scraped ${allCars.length} cars`);
		}

		return allCars;
	}

	/**
	 * Scrape detailed information and images for a single car
	 */
	async scrapeCarDetails(detailsLink: string): Promise<any> {
		try {
			const newPage = await this.browser.newPage();

			// Random viewport for better anti-detection
			const viewports = [
				{ width: 1920, height: 1080 },
				{ width: 1366, height: 768 },
			];
			const viewport = viewports[Math.floor(Math.random() * viewports.length)];
			await newPage.setViewport(viewport);
			await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

			// Navigate to detail page
			await Promise.race([newPage.goto(detailsLink, { waitUntil: 'networkidle0', timeout: 20000 }), new Promise((resolve) => setTimeout(resolve, 10000))]).catch(() => {});

			await randomDelay(500, 1000);

			const details = await newPage
				.evaluate(() => {
					const allImages: string[] = [];

					// Try all image sources - look for car images
					const images = document.querySelectorAll('img');
					images.forEach((img) => {
						const src = img.src || img.getAttribute('data-src') || '';
						// Capture Copart image patterns
						if (
							src &&
							(src.includes('copart.com') || src.includes('iaai')) &&
							(src.endsWith('_thb.jpg') || src.endsWith('_thb.png') || src.includes('/vehicle/') || src.includes('/lot/'))
						) {
							allImages.push(src);
						}
					});

					// Also check for image gallery or lightbox images
					const galleryImages = document.querySelectorAll('[class*="image"], [class*="gallery"], [class*="photo"]');
					galleryImages.forEach((elem) => {
						const img = elem.querySelector('img');
						if (img) {
							const src = img.src || img.getAttribute('data-src') || '';
							if (src && !allImages.includes(src)) {
								allImages.push(src);
							}
						}
					});

					// Remove duplicates and convert thumbnails to high-res
					const uniqueImages = [...new Set(allImages)]
						.map((url) =>
							url
								.replace(/_thb\.jpg$/, '_hrs.jpg')
								.replace(/_thb\.png$/, '_hrs.png')
								.replace(/_ful\.jpg$/, '_hrs.jpg'),
						)
						.slice(0, 30); // Increased limit to 30 images

					// Get text content for additional details
					const allText = document.body.textContent || '';

					// Extract VIN
					const vinMatch = allText.match(/VIN[:\s]*([A-HJ-NPR-Z0-9]{17})/i);
					const vin = vinMatch ? vinMatch[1] : '';

					// Extract transmission
					const transmission = allText.includes('Automatic') ? 'Automatic' : allText.includes('Manual') ? 'Manual' : allText.includes('CVT') ? 'CVT' : '';

					// Extract body type
					const bodyTypeMatch = allText.match(/(?:sedan|suv|coupe|hatchback|wagon|truck|van|convertible|pickup|minivan)/gi);
					const bodyType = bodyTypeMatch ? bodyTypeMatch[0] : '';

					// Extract color
					const colorMatch = allText.match(/(?:color|exterior)[:\s]*([a-z\s]+?)(?:\n|,|;|$)/gi);
					let color = '';
					if (colorMatch && colorMatch[0]) {
						const colorText = colorMatch[0].replace(/(?:color|exterior)[:\s]*/gi, '').trim();
						color = colorText.split(/[\n,;]/)[0].trim();
					}

					// Extract engine
					const engineMatch = allText.match(/(\d\.\d[L]?[\s]?(?:L|V\d|I\d|H\d)?)/i);
					const engine = engineMatch ? engineMatch[0] : '';

					// Extract odometer
					const odometerMatch = allText.match(/(\d{1,3}(?:,\d{3})*)\s*(?:mi|miles|km)/i);
					const odometer = odometerMatch ? odometerMatch[1].replace(/,/g, '') : '';

					// Extract highlights
					const highlights: string[] = [];
					const highlightElements = document.querySelectorAll('[class*="highlight"], [class*="feature"], li');
					highlightElements.forEach((elem) => {
						const text = elem.textContent?.trim() || '';
						if (text.length > 5 && text.length < 100 && !text.includes('©') && !text.includes('Privacy')) {
							highlights.push(text);
						}
					});

					return {
						images: uniqueImages,
						vin: vin,
						transmission: transmission,
						bodyType: bodyType,
						color: color,
						engine: engine,
						odometer: odometer,
						highlights: highlights.slice(0, 10),
					};
				})
				.catch(() => ({
					images: [],
					vin: '',
					transmission: '',
					bodyType: '',
					color: '',
					engine: '',
					odometer: '',
					highlights: [],
				}));

			await newPage.close();
			return details;
		} catch (error) {
			console.error(`Error scraping car details from ${detailsLink}:`, (error as Error).message);
			return {
				images: [],
				vin: '',
				transmission: '',
				bodyType: '',
				color: '',
				engine: '',
				odometer: '',
				highlights: [],
			};
		}
	}

	/**
	 * Scrape auction cars with detailed information and images
	 * NOTE: Details fetching is very slow. Recommended: use scrapeAuctionCars() only,
	 * then run enhance-existing-data.ts afterwards for AI parsing
	 */
	async scrapeAuctionCarsWithDetails(auctionUrl: string, carsPerPage: number = 20, limit: number | null = null, fetchDetails: boolean = false) {
		const basicCars = await this.scrapeAuctionCars(auctionUrl, carsPerPage, limit);

		if (!fetchDetails || basicCars.length === 0) {
			return basicCars;
		}

		console.log(`\n  Fetching details for ${basicCars.length} cars...`);

		for (let i = 0; i < basicCars.length; i++) {
			const car = basicCars[i];
			if (car.detailsLink) {
				console.log(`    [${i + 1}/${basicCars.length}] Fetching details for ${car.title}...`);
				const details = await this.scrapeCarDetails(car.detailsLink);

				// Merge details into car object
				car.images = details.images && details.images.length > 0 ? details.images : [];
				// If we have detailed images, set primary imageUrl from first image
				if (car.images.length > 0) {
					car.imageUrl = car.images[0];
				}
				if (!car.transmission && details.transmission) {
					car.transmission = details.transmission;
				}
				if (!car.bodyType && details.bodyType) {
					car.bodyType = details.bodyType;
				}
				if (!car.color && details.color) {
					car.color = details.color;
				}

				// Log what we found
				if (car.images.length > 0) {
					console.log(`      ✓ Found ${car.images.length} images`);
				}
				if (details.transmission) {
					console.log(`      ✓ Transmission: ${details.transmission}`);
				}

				// Add a small delay between requests to be respectful
				await delay(500);
			}
		}

		return basicCars;
	}

	/**
	 * Scrape all today's auctions with cars
	 */
	async scrapeAllAuctionsWithCars(autoSaveFilename: string | null = null) {
		const auctions = await this.scrapeTodaysAuctions();

		if (auctions.length === 0) {
			console.log('No auctions found!');
			return auctions;
		}

		// Create results directory at the start
		const resultsDir = './results';
		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir, { recursive: true });
		}

		console.log(`\nProcessing ${auctions.length} auctions...`);

		for (let i = 0; i < auctions.length; i++) {
			const auction = auctions[i];
			console.log(`\n[${i + 1}/${auctions.length}] ${auction.location}`);

			if (auction.viewSalesLink) {
				try {
					auction.cars = await this.scrapeAuctionCars(auction.viewSalesLink);
					console.log(`  Found ${auction.cars.length} cars`);
					await new Promise((resolve) => setTimeout(resolve, 1000));
				} catch (error) {
					console.error(`  Error: ${error.message}`);
					auction.cars = [];
				}
			}

			// Save progress after each auction
			this.results = auctions;
			if (autoSaveFilename) {
				await this.saveResultsQuick(autoSaveFilename);
			}
		}

		this.results = auctions;
		return auctions;
	}

	/**
	 * Scrape calendar auctions with cars
	 */
	async scrapeCalendarAuctionsWithCars(targetMonth: string = 'January', autoSaveFilename: string | null = null) {
		const auctions = await this.scrapeCalendarAuctions(targetMonth);

		if (auctions.length === 0) {
			console.log('No auctions found!');
			return auctions;
		}

		// Create results directory at the start
		const resultsDir = './results';
		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir, { recursive: true });
		}

		console.log(`\nProcessing ${auctions.length} auctions...`);

		for (let i = 0; i < auctions.length; i++) {
			const auction = auctions[i];
			console.log(`\n[${i + 1}/${auctions.length}] ${auction.location}`);

			if (auction.viewSalesLink) {
				try {
					auction.cars = await this.scrapeAuctionCars(auction.viewSalesLink);
					console.log(`  Found ${auction.cars.length} cars`);
					await new Promise((resolve) => setTimeout(resolve, 1000));
				} catch (error) {
					console.error(`  Error: ${error.message}`);
					auction.cars = [];
				}
			}

			// Save progress after each auction
			this.results = auctions;
			if (autoSaveFilename) {
				await this.saveResultsQuick(autoSaveFilename);
			}
		}

		this.results = auctions;
		return auctions;
	}

	/**
	 * Scrape a specific auction by direct URL
	 */
	async scrapeSpecificAuctionByUrl(auctionUrl: string, auctionName: string, autoSaveFilename: string | null = null) {
		console.log(`\nScraping specific auction: ${auctionName}`);
		console.log(`URL: ${auctionUrl}\n`);

		// Create results directory
		const resultsDir = './results';
		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir, { recursive: true });
		}

		// Scrape cars for this specific auction
		console.log(`Scraping cars (limit: 3 for development)...`);
		try {
			// First get basic car data
			const cars = await this.scrapeAuctionCars(auctionUrl, 20, 3); // Limit to 3 cars
			console.log(`✓ Found ${cars.length} cars`);

			// NOTE: Skipping details by default - they take very long due to AI parsing
			// If you need images/details, run: npx tsx lib/scrapers/test/enhance-existing-data.ts
			const skipDetails = true; // Set to false if you want details (much slower)

			if (!skipDetails && cars.length > 0) {
				console.log(`\nFetching detailed information and images...`);
				for (let i = 0; i < cars.length; i++) {
					const car = cars[i];
					if (car.detailsLink) {
						console.log(`  [${i + 1}/${cars.length}] ${car.title || car.lotNumber}...`);
						const details = await this.scrapeCarDetails(car.detailsLink);

						// Merge details into car object
						car.images = details.images && details.images.length > 0 ? details.images : [car.imageUrl];
						if (details.transmission) car.transmission = details.transmission;
						if (details.bodyType) car.bodyType = details.bodyType;
						if (details.color) car.color = details.color;

						// Log what we found
						if (car.images.length > 1) {
							console.log(`    ✓ Found ${car.images.length} images`);
						}

						// Add human-like delay between detail requests
						await randomDelay(500, 800);
					}
				}
			} else if (skipDetails) {
				console.log(`\n✅ Scraping complete! Got ${cars.length} cars in basic format.`);
				console.log(`\n📝 NEXT STEP: Run AI parsing for make/model/trim extraction:`);
				console.log(`   npx tsx lib/scrapers/test/enhance-existing-data.ts`);
				console.log(`   This will enhance the data with accurate make/model/trim/bodyType using AI\n`);
			}

			const result = {
				location: auctionName,
				viewSalesLink: auctionUrl,
				cars: cars,
			};

			this.results = [result];

			if (autoSaveFilename) {
				await this.saveResultsQuick(autoSaveFilename);
			}

			return [result];
		} catch (error) {
			console.error(`✗ Error: ${error.message}`);
			return [];
		}
	}

	/**
	 * Scrape a specific auction by location name
	 */
	async scrapeSpecificAuctionByLocation(locationName: string, targetMonth: string = 'January', autoSaveFilename: string | null = null) {
		console.log(`\nFinding auction: ${locationName} from ${targetMonth}...`);
		const allAuctions = await this.scrapeCalendarAuctions(targetMonth);

		// Find matching auction
		const targetAuction = allAuctions.find((a) => a.location.includes(locationName));

		if (!targetAuction) {
			console.log(`\n❌ Could not find auction matching: ${locationName}`);
			console.log(`Available auctions:`);
			allAuctions.forEach((a) => console.log(`  - ${a.location}`));
			return [];
		}

		console.log(`✓ Found: ${targetAuction.location}`);

		// Create results directory
		const resultsDir = './results';
		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir, { recursive: true });
		}

		// Scrape cars for this specific auction
		console.log(`\nScraping cars from: ${targetAuction.location}`);
		if (targetAuction.viewSalesLink) {
			try {
				targetAuction.cars = await this.scrapeAuctionCars(targetAuction.viewSalesLink);
				console.log(`✓ Found ${targetAuction.cars.length} cars`);
			} catch (error) {
				console.error(`✗ Error: ${error.message}`);
				targetAuction.cars = [];
			}
		}

		this.results = [targetAuction];

		if (autoSaveFilename) {
			await this.saveResultsQuick(autoSaveFilename);
		}

		return [targetAuction];
	}

	/**
	 * Quick save without fancy formatting
	 */
	async saveResultsQuick(filename: string) {
		try {
			const filepath = `./results/${filename}`;
			fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));

			// Also update HTML
			const htmlFilename = filename.replace('.json', '.html');
			const htmlPath = `./results/${htmlFilename}`;
			this.saveHTMLReport(htmlPath);
		} catch (error) {
			console.error(`  Error saving progress: ${error.message}`);
		}
	}

	async scrollToLoadMore(scrolls: number = 3) {
		console.log('Scrolling to load more content...');
		for (let i = 0; i < scrolls; i++) {
			await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await delay(2000);
		}
	}

	async saveResults(filename: string = 'copart_results.json') {
		const resultsDir = './results';
		const absolutePath = path.resolve(resultsDir);

		console.log(`Creating results directory: ${absolutePath}`);

		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir, { recursive: true });
			console.log(`✓ Results directory created`);
		} else {
			console.log(`✓ Results directory exists`);
		}

		const filepath = `${resultsDir}/${filename}`;
		const absoluteFilepath = path.resolve(filepath);

		console.log(`Saving JSON to: ${absoluteFilepath}`);
		fs.writeFileSync(filepath, JSON.stringify(this.results, null, 2));
		console.log(`✓ JSON saved`);

		// Also save as HTML report
		const htmlFilename = filename.replace('.json', '.html');
		const htmlPath = `${resultsDir}/${htmlFilename}`;

		console.log(`Saving HTML to: ${path.resolve(htmlPath)}`);
		this.saveHTMLReport(htmlPath);

		return absoluteFilepath;
	}

	private saveHTMLReport(filepath: string) {
		const isAuctionFormat = this.results.length > 0 && this.results[0].hasOwnProperty('cars');
		let html = '';

		if (isAuctionFormat) {
			const totalCars = this.results.reduce((sum, auction) => sum + (auction.cars?.length || 0), 0);

			html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copart Auctions Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .stats { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .auction { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .auction-header { border-bottom: 2px solid #0757ac; padding-bottom: 10px; margin-bottom: 15px; }
        .auction-title { font-size: 24px; font-weight: bold; color: #0757ac; }
        .auction-info { margin: 5px 0; color: #666; }
        .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-top: 15px; }
        .car-card { background: #f9f9f9; border-radius: 6px; padding: 12px; border: 1px solid #e0e0e0; }
        .car-card img { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 8px; }
        .car-title { font-weight: bold; font-size: 14px; color: #333; }
        .car-detail { margin: 4px 0; font-size: 13px; color: #666; }
        .price { font-size: 16px; font-weight: bold; color: #e74c3c; margin: 5px 0; }
        .link { color: #0757ac; text-decoration: none; font-size: 13px; }
        .link:hover { text-decoration: underline; }
        .no-cars { color: #999; font-style: italic; }
    </style>
</head>
<body>
    <h1>🚗 Copart Auctions - ${new Date().toLocaleDateString()}</h1>
    <div class="stats">
        <p><strong>Total Auctions:</strong> ${this.results.length}</p>
        <p><strong>Total Cars:</strong> ${totalCars}</p>
        <p><strong>Scraped:</strong> ${new Date().toLocaleString()}</p>
    </div>
    ${this.results
		.map(
			(auction) => `
        <div class="auction">
            <div class="auction-header">
                <div class="auction-title">${auction.location || 'Unknown Location'}</div>
                ${auction.saleType ? `<div class="auction-info">📋 Sale Type: ${auction.saleType}</div>` : ''}
                ${auction.saleDate ? `<div class="auction-info">📅 Date: ${auction.saleDate}</div>` : ''}
                ${auction.saleTime ? `<div class="auction-info">🕐 Time: ${auction.saleTime}</div>` : ''}
                ${auction.viewSalesLink ? `<div class="auction-info"><a href="${auction.viewSalesLink}" class="link" target="_blank">View Sales Page →</a></div>` : ''}
                <div class="auction-info"><strong>Cars: ${auction.cars?.length || 0}</strong></div>
            </div>
            ${
				auction.cars && auction.cars.length > 0
					? `
                <div class="car-grid">
                    ${auction.cars
						.map(
							(car) => `
                        <div class="car-card">
                            ${car.imageUrl ? `<img src="${car.imageUrl}" alt="${car.title}" onerror="this.style.display='none'">` : ''}
                            <div class="car-title">${car.title || `${car.year} ${car.make} ${car.model}`.trim() || 'Vehicle'}</div>
                            ${car.lotNumber ? `<div class="car-detail"><strong>Lot:</strong> ${car.lotNumber}</div>` : ''}
                            ${car.vin ? `<div class="car-detail"><strong>VIN:</strong> ${car.vin}</div>` : ''}
                            ${car.odometer ? `<div class="car-detail"><strong>Odometer:</strong> ${car.odometer}</div>` : ''}
                            ${car.damage ? `<div class="car-detail"><strong>Damage:</strong> ${car.damage}</div>` : ''}
                            ${car.price ? `<div class="price">${car.price}</div>` : ''}
                            ${car.detailsLink ? `<a href="${car.detailsLink}" class="link" target="_blank">View Details →</a>` : ''}
                        </div>
                    `,
						)
						.join('')}
                </div>
            `
					: '<div class="no-cars">No cars found for this auction</div>'
			}
        </div>
    `,
		)
		.join('')}
</body>
</html>`;
		} else {
			html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copart Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        .stats { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .car-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .car-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .car-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; }
        .car-title { font-weight: bold; font-size: 18px; margin: 10px 0; color: #0757ac; }
        .car-detail { margin: 5px 0; color: #666; }
        .price { font-size: 20px; font-weight: bold; color: #e74c3c; }
        .link { color: #0757ac; text-decoration: none; }
        .link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>🚗 Copart Results</h1>
    <div class="stats">
        <p><strong>Total Listings:</strong> ${this.results.length}</p>
        <p><strong>Scraped:</strong> ${new Date().toLocaleString()}</p>
    </div>
    <div class="car-grid">
        ${this.results
			.map(
				(car) => `
            <div class="car-card">
                ${car.imageUrl ? `<img src="${car.imageUrl}" alt="${car.title}" onerror="this.style.display='none'">` : ''}
                <div class="car-title">${car.title || `${car.year} ${car.make} ${car.model}`}</div>
                ${car.lotNumber ? `<div class="car-detail">Lot: ${car.lotNumber}</div>` : ''}
                ${car.vin ? `<div class="car-detail">VIN: ${car.vin}</div>` : ''}
                ${car.price ? `<div class="price">${car.price}</div>` : ''}
                ${car.damage ? `<div class="car-detail">Damage: ${car.damage}</div>` : ''}
                ${car.odometer ? `<div class="car-detail">Odometer: ${car.odometer}</div>` : ''}
            </div>
        `,
			)
			.join('')}
    </div>
</body>
</html>`;
		}

		fs.writeFileSync(filepath, html);
		console.log(`HTML report saved to ${filepath}`);
	}

	async close() {
		if (this.browser) {
			await this.browser.close();
			console.log('Browser closed');
		}
	}
}

// Example usage
async function main() {
	const scraper = new CopartScraper({ headless: false });

	try {
		console.log('Initializing scraper...');
		await scraper.initialize();

		// Direct URL for NCS Central Region 01/20/26 auction
		const auctionUrl = 'https://www.copart.com/saleListResult/881/2026-01-20?location=*NCS - Central Region&saleDate=1768960800000&liveAuction=false&from=&yardNum=881';
		const auctionName = '*NCS - Central Region 01/20/26';

		console.log(`=== Scraping Specific Auction ===`);
		console.log(`Location: ${auctionName}`);
		console.log(`Date: 01/20/26\n`);

		const filename = `auction_ncs_central_${new Date().toISOString().split('T')[0]}.json`;
		const auctions = await scraper.scrapeSpecificAuctionByUrl(auctionUrl, auctionName, filename);

		console.log('\n=== Summary ===');
		if (auctions.length > 0) {
			const auction = auctions[0];
			console.log(`Auction: ${auction.location}`);
			console.log(`Total Cars: ${auction.cars?.length || 0}`);
			console.log(`\n✓ Results saved!`);
		} else {
			console.log('⚠️  Could not scrape the auction.');
		}
	} finally {
		try {
			await scraper.close();
		} catch (closeError) {
			console.error('Error closing browser:', (closeError as Error).message);
		}
	}
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
	main().catch(console.error);
}

export default CopartScraper;
