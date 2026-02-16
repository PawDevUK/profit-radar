import fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer';
// Update the import path below to the correct relative path if needed
import { proxyConfig, ProxyConfig } from '@/lib/scrapers/proxy/proxy-config';

// Define LotDetails type (adjust fields as needed)
export interface LotDetails {
	lotNumber: string;
	title: string;
	year: string;
	make: string;
	model: string;
	ymm: string;
	damage: string;
	saleDate: string;
	saleTime: string;
	detailsLink: string;
	auctionUrl: string;
	imageUrl: string;
	price: string;
	buyItNowPrice: string;
	estimatedRetailValue: string;
	odometer: string;
	vin: string;
	bodyType: string;
	color: string;
	transmission: string;
	titleCode: string;
	engineStarts: string;
	transmissionEngages: string;
	hasKey: string;
	highlights: string[];
	notes: string;
}

/**
 * CopartSaleListScraper - Scrapes list of cars for a specific auction
 * Independent from calendar scraper, takes auction URL as input
 */
// ProxyConfig is now imported from proxy-config, so no need to redefine it here

export interface CopartSaleListScraperConfig {
	headless?: boolean;
	timeout?: number;
	captchaWaitTime?: number;
	proxy?: ProxyConfig;
	carsPerPage?: number;
	limit?: number;
}

export class CopartSaleListScraper {
	headless: boolean;
	timeout: number;
	captchaWaitTime: number;
	browser: Browser | null;
	page: Page | null;
	proxy: ProxyConfig;

	constructor(config: CopartSaleListScraperConfig = {}) {
		this.headless = config.headless !== undefined ? config.headless : true;
		this.timeout = config.timeout || 60000;
		this.captchaWaitTime = config.captchaWaitTime || 120000; // 2 minutes default
		this.browser = null;
		this.page = null;
		this.proxy = config.proxy !== undefined ? config.proxy : proxyConfig;
	}

	/**
	 * Initialize browser and page with anti-detection measures
	 */
	async initialize() {
		console.log('Initializing sale list scraper...');
		console.log('Proxy config:', this.proxy);

		if (this.proxy?.enabled) {
			console.log(`Launching browser for sale list scraper with proxy: ${this.proxy.server}`);
		} else {
			console.log('Launching browser for sale list scraper...');
		}

		const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled', '--disable-web-resources'];

		// Add proxy args if configured
		if (this.proxy?.enabled && this.proxy?.server) {
			launchArgs.push(`--proxy-server=${this.proxy.server}`);
		}

		this.browser = await puppeteer.launch({
			headless: this.headless,
			args: launchArgs,
		});

		this.page = await this.browser.newPage();

		// Authenticate proxy if credentials provided
		if (this.proxy?.enabled && this.proxy?.username && this.proxy?.password) {
			await this.page.authenticate({
				username: this.proxy.username,
				password: this.proxy.password,
			});
			console.log('  ✓ Proxy authentication configured');
		}

		await this.page.setViewport({ width: 1920, height: 1080 });

		// Set realistic headers to avoid bot detection
		await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

		// Anti-detection measures
		await this.page.evaluateOnNewDocument(() => {
			Object.defineProperty(navigator, 'webdriver', {
				get: () => false,
			});
			Object.defineProperty(navigator, 'plugins', {
				get: () => [1, 2, 3, 4, 5],
			});
			Object.defineProperty(navigator, 'languages', {
				get: () => ['en-US', 'en'],
			});
		});

		// Set HTTP headers
		await this.page.setExtraHTTPHeaders({
			'Accept-Language': 'en-US,en;q=0.9',
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, br',
			'Sec-Fetch-Dest': 'document',
			'Sec-Fetch-Mode': 'navigate',
			'Sec-Fetch-Site': 'none',
			'Cache-Control': 'max-age=0',
		});
	}

	/**
	 * Check for CAPTCHA and wait for manual solving
	 */
	async checkAndHandleCaptcha(): Promise<boolean> {
		if (!this.page) {
			throw new Error('Scraper not initialized. Call initialize() first.');
		}
		const hasCaptcha = await this.page.evaluate(() => {
			return !!(
				document.querySelector('iframe[src*="captcha"]') ||
				document.querySelector('iframe[src*="recaptcha"]') ||
				document.querySelector('.g-recaptcha') ||
				document.querySelector('#captcha')
			);
		});

		if (hasCaptcha) {
			console.log('  ⚠️  CAPTCHA detected! Waiting for manual solving...');
			console.log(`     You have ${this.captchaWaitTime / 1000} seconds to solve it.`);

			// Wait for CAPTCHA to be solved
			const startTime = Date.now();
			while (Date.now() - startTime < this.captchaWaitTime) {
				const stillHasCaptcha = await this.page.evaluate(() => {
					return !!(
						document.querySelector('iframe[src*="captcha"]') ||
						document.querySelector('iframe[src*="recaptcha"]') ||
						document.querySelector('.g-recaptcha') ||
						document.querySelector('#captcha')
					);
				});

				if (!stillHasCaptcha) {
					console.log('  ✓ CAPTCHA appears to be solved!');
					return true;
				}

				await new Promise((resolve) => setTimeout(resolve, 2000)); // Check every 2 seconds
			}

			console.log('  ❌ CAPTCHA timeout - could not verify if solved');
			return false;
		}

		return true;
	}

	/**
	 * Scrape list of cars from auction page
	 */
	async scrapeSaleList(auctionUrl: string, options: { carsPerPage?: number; limit?: number } = {}): Promise<LotDetails[]> {
		const carsPerPage = options.carsPerPage || 20;
		const limit = options.limit || null;

		if (!this.page) {
			throw new Error('Scraper not initialized. Call initialize() first.');
		}

		console.log(`Navigating to auction: ${auctionUrl}`);

		try {
			console.log('Loading auction page...');
			await this.page.goto(auctionUrl, {
				waitUntil: 'domcontentloaded',
				timeout: 30000,
			});
			console.log('Auction page loaded');
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log(`Navigation error: ${error.message}`);
				throw new Error(`Failed to load auction page: ${error.message}`);
			} else {
				console.log('Navigation error:', error);
				throw new Error('Failed to load auction page: Unknown error');
			}
		}

		// Save page snapshot for debugging
		try {
			const html = await this.page.content();
			fs.writeFileSync('./results/sale_list_snapshot.html', html);
			console.log('Saved sale list snapshot to ./results/sale_list_snapshot.html');
		} catch (e: unknown) {
			if (e instanceof Error) {
				console.log('Could not save snapshot:', e.message);
			} else {
				console.log('Could not save snapshot:', e);
			}
		}

		console.log('Waiting for dynamic content...');
		// Wait for dynamic content - Copart loads cars via JavaScript
		await new Promise((resolve) => setTimeout(resolve, 5000)); // Increased wait time
		console.log('Dynamic content wait complete');

		// Wait for car elements to appear (they might load via AJAX)
		console.log('Waiting for car data to load...');
		try {
			await this.page.waitForFunction(
				() => {
					// Check for various car data indicators
					return (
						document.querySelectorAll('[data-lot], .lot-number, [data-lotnumber], .car-item, .vehicle-item').length > 0 ||
						document.querySelectorAll('a[href*="lotdetails"]').length > 0 ||
						document.querySelectorAll('tbody tr').length > 5
					); // At least some table rows
				},
				{ timeout: 15000 }, // Wait up to 15 seconds for cars to load
			);
			console.log('Car data appears to be loaded');
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log('Warning: Car data may not have loaded within timeout:', error.message);
			} else {
				console.log('Warning: Car data may not have loaded within timeout:', error);
			}
		}

		// Check for CAPTCHA
		console.log('Checking for CAPTCHA...');
		const captchaOk = await this.checkAndHandleCaptcha();
		if (!captchaOk) {
			console.log('CAPTCHA check failed');
			return [];
		}
		console.log('CAPTCHA check passed');

		// Parse the cars from the page
		console.log('Parsing cars from page...');
		const cars = await this.parseAuctionCars(limit);

		console.log(`Found ${cars.length} cars in auction`);
		return cars;
	}

	/**
	 * Parse cars from the auction page
	 */
	async parseAuctionCars(limit: number | null = null): Promise<LotDetails[]> {
		if (!this.page) throw new Error('Scraper not initialized. Call initialize() first.');
		return await this.page.evaluate((maxCars) => {
			const cars = [];

			// Find all car rows - Copart uses various modern selectors
			const selectors = [
				// Modern data attributes
				'[data-lot]',
				'[data-lotnumber]',
				'[data-vehicle]',
				'[data-car]',
				'.lot-row',
				'.vehicle-row',
				'.car-item',
				'.vehicle-item',
				// Table-based selectors
				'tbody tr[data-url]',
				'tbody tr[data-lot]',
				'.table tbody tr',
				'tr[data-url]',
				'tr[data-lot]',
				'[data-url*="lotdetails"]',
				'a[href*="lotdetails"]',
				// Generic table rows (but filter out headers)
				'tbody tr',
			];

			let rows: Element[] = [];
			for (const sel of selectors) {
				rows = Array.from(document.querySelectorAll(sel));
				// Filter out header rows and empty rows
				rows = rows.filter((row) => {
					const text = row.textContent?.trim() || '';
					const hasLotLink =
						row.querySelector('a[href*="lotdetails"]') ||
						row.querySelector('[data-url*="lotdetails"]') ||
						row.getAttribute('data-lot') ||
						row.getAttribute('data-lotnumber');
					return text.length > 10 && (hasLotLink || text.includes('Lot') || text.includes('lot'));
				});
				if (rows.length > 0) break;
			}

			console.log(`Found ${rows.length} potential car rows`);

			for (let i = 0; i < rows.length && (!maxCars || i < maxCars); i++) {
				const row = rows[i];

				// Extract details link - most important for identification
				let detailsLink = '';
				const linkSelectors = ['a[href*="lotdetails"]', '[data-url*="lotdetails"]', 'a[href*="lot/"]', '[data-url*="lot/"]', 'a[data-lot]', 'a'];
				for (const sel of linkSelectors) {
					const el = row.querySelector(sel);
					if (el) {
						const href = el.getAttribute('href') || el.getAttribute('data-url') || '';
						if (href && (href.includes('lotdetails') || href.includes('/lot/'))) {
							detailsLink = href.startsWith('http') ? href : `https://www.copart.com${href}`;
							break;
						}
					}
				}

				// Extract lot number - try multiple approaches
				let lotNumber = '';
				const lotSelectors = ['[data-lotnumber]', '[data-lot]', '.lot-number', '.lot', 'td:first-child', 'td:nth-child(1)', '[data-lotnumber] span', '[data-lot] span'];
				for (const sel of lotSelectors) {
					const el = row.querySelector(sel);
					if (el) {
						// Look for actual lot number pattern (digits)
						const text = el.textContent?.trim() || '';
						const lotMatch = text.match(/(\d{7,})/); // Lot numbers are typically 7+ digits
						if (lotMatch) {
							lotNumber = lotMatch[1];
							break;
						}
						// Also check attributes
						const attrLot = el.getAttribute('data-lotnumber') || el.getAttribute('data-lot');
						if (attrLot && /^\d{7,}$/.test(attrLot)) {
							lotNumber = attrLot;
							break;
						}
					}
				}

				// Also check row attributes
				if (!lotNumber) {
					const rowLot = row.getAttribute('data-lotnumber') || row.getAttribute('data-lot');
					if (rowLot && /^\d{7,}$/.test(rowLot)) {
						lotNumber = rowLot;
					}
				}

				// Extract from details link if still not found
				if (!lotNumber && detailsLink) {
					const lotMatch = detailsLink.match(/\/lot\/(\d+)/);
					if (lotMatch) lotNumber = lotMatch[1];
				}

				// Extract year/make/model - parse from the concatenated text
				let ymm = '';
				const ymmSelectors = ['[data-yearmake]', '[data-ymm]', '.ymm', '.year-make-model', 'td:nth-child(2)', 'td:nth-child(3)', '.vehicle-info', '.car-info'];
				for (const sel of ymmSelectors) {
					const el = row.querySelector(sel);
					if (el) {
						const text = el.textContent?.trim() || '';
						// Try to extract year/make/model from text like "Lot info 2019 TOYOTA C-HR XLE Lot # 99996015"
						const ymmMatch = text.match(/(\d{4})\s+([A-Z\s]+?)\s+([A-Z0-9\s-]+)/i);
						if (ymmMatch) {
							ymm = `${ymmMatch[1]} ${ymmMatch[2].trim()} ${ymmMatch[3].trim()}`;
							break;
						}
						// Fallback to any reasonable text
						if (text.length > 10 && text.length < 100) {
							ymm = text;
							break;
						}
					}
				}

				// Extract damage type
				let damage = '';
				const damageSelectors = ['[data-damage]', '.damage', '.damage-type', 'td:nth-child(3)', 'td:nth-child(4)', '.condition'];
				for (const sel of damageSelectors) {
					const el = row.querySelector(sel);
					if (el) {
						damage = el.textContent?.trim() || '';
						if (damage) break;
					}
				}

				// Extract sale date/time
				let saleDate = '';
				let saleTime = '';
				const dateSelectors = ['[data-saledate]', '[data-saletime]', '.sale-date', '.sale-time', 'td:nth-child(4)', 'td:nth-child(5)'];
				for (const sel of dateSelectors) {
					const el = row.querySelector(sel);
					if (el) {
						const dateText = el.textContent?.trim() || '';
						// Parse date/time if available
						const dateMatch = dateText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
						const timeMatch = dateText.match(/(\d{1,2}:\d{2}\s?[AP]M)/i);
						if (dateMatch) saleDate = dateMatch[1];
						if (timeMatch) saleTime = timeMatch[1];
						if (saleDate || saleTime) break;
					}
				}

				// Extract image URL if available
				let imageUrl = '';
				const imageSelectors = ['img[src*="copart"]', 'img[src*="lot"]', 'img.vehicle-image', 'img.car-image', '[data-image]', 'img'];
				for (const sel of imageSelectors) {
					const img = row.querySelector(sel);
					if (img) {
						const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
						if (src && !src.includes('placeholder') && !src.includes('no-image')) {
							imageUrl = src.startsWith('http') ? src : `https://www.copart.com${src}`;
							break;
						}
					}
				}

				// Only add if we have at least a lot number or details link
				if (lotNumber || detailsLink) {
					// Extract lot number from URL if not found elsewhere
					if (!lotNumber && detailsLink) {
						const lotMatch = detailsLink.match(/\/lot\/(\d+)/);
						if (lotMatch) lotNumber = lotMatch[1];
					}

					// Parse ymm into separate fields
					let year = '',
						make = '',
						model = '';
					const title = ymm || 'Unknown';
					if (ymm && ymm !== 'Unknown') {
						const ymmMatch = ymm.match(/(\d{4})\s+([A-Z\s]+?)\s+([A-Z0-9\s-]+)/i);
						if (ymmMatch) {
							year = ymmMatch[1];
							make = ymmMatch[2].trim();
							model = ymmMatch[3].trim();
						}
					}

					cars.push({
						lotNumber: lotNumber || 'Unknown',
						title: title,
						year: year,
						make: make,
						model: model,
						ymm: ymm || 'Unknown',
						damage: damage || 'Unknown',
						saleDate: saleDate || '',
						saleTime: saleTime || '',
						detailsLink: detailsLink || '',
						auctionUrl: window.location.href,
						imageUrl: imageUrl || '',
						// Default/placeholder values for other expected fields
						price: '',
						buyItNowPrice: '',
						estimatedRetailValue: '',
						odometer: '',
						vin: '',
						bodyType: '',
						color: '',
						transmission: '',
						titleCode: '',
						engineStarts: '',
						transmissionEngages: '',
						hasKey: '',
						highlights: [],
						notes: '',
					});
				}
			}

			return cars.slice(0, maxCars || cars.length);
		}, limit);
	}

	/**
	 * Save results to file
	 */
	async saveResults(cars: LotDetails[], filePath = './results/sale_list.json'): Promise<void> {
		fs.mkdirSync('./results', { recursive: true });
		fs.writeFileSync(filePath, JSON.stringify(cars, null, 2));
		console.log(`\n✅ Saved ${cars.length} cars to ${filePath}`);
	}

	/**
	 * Close browser and cleanup
	 */
	async close(): Promise<void> {
		if (this.browser) {
			await this.browser.close();
			console.log('Browser closed');
		}
	}
}

/**
 * Convenience function to scrape sale list with automatic initialization and cleanup
 */
export async function scrapeCopartSaleList(auctionUrl: string, options: CopartSaleListScraperConfig = {}): Promise<LotDetails[]> {
	const scraper = new CopartSaleListScraper(options);
	try {
		await scraper.initialize();
		const { carsPerPage, limit } = options as CopartSaleListScraperConfig;
		const cars = await scraper.scrapeSaleList(auctionUrl, { carsPerPage, limit });
		return cars;
	} finally {
		await scraper.close();
	}
}
