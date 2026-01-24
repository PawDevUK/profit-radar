// @ts-nocheck
import fs from 'fs';
import path from 'path';
import puppeteer, { type Browser, type Page } from 'puppeteer';
import { fileURLToPath } from 'url';

type HeadlessOption = boolean | 'new';

type ScraperConfig = {
	headless?: HeadlessOption;
	timeout?: number;
};

class CarAuctionScraper {
	private browser!: Browser;
	private page!: Page;
	private headless: HeadlessOption;
	private timeout: number;
	private results: any[];

	constructor(config: ScraperConfig = {}) {
		this.headless = config.headless !== undefined ? config.headless : 'new';
		this.timeout = config.timeout || 60000;
		this.results = [];
	}

	async initialize() {
		console.log('Launching browser...');
		this.browser = await puppeteer.launch({
			headless: this.headless,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		});
		this.page = await this.browser.newPage();
		await this.page.setViewport({ width: 1920, height: 1080 });
		await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
	}

	async scrapeTodaysAuctions() {
		console.log("Navigating to Today's Auctions...");

		await this.page.goto('https://www.copart.com/todaysAuction', {
			waitUntil: 'domcontentloaded',
			timeout: this.timeout,
		});

		console.log('Page loaded, waiting for content...');
		await this.page.waitForTimeout(3000);

		// Extract auction locations
		const auctions = await this.page.evaluate(() => {
			const auctionList = [];
			const tableRows = document.querySelectorAll('tbody tr');

			tableRows.forEach((element) => {
				try {
					const cells = element.querySelectorAll('td');
					if (cells.length < 2) return;

					// Get all text from the row to parse better
					const allText = Array.from(cells).map((c) => c.textContent?.trim() || '');

					// Find the actual location (usually first non-empty, longer text)
					let location = allText.find((text) => text.length > 10 && !text.includes('GMT') && !text.includes(':')) || allText[0] || '';

					// Clean up location
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

	// Scrape auctions from the calendar page, filtering by month name (e.g., "January")
	async scrapeCalendarAuctions(targetMonth: string = 'January') {
		console.log(`Navigating to auction calendar (month: ${targetMonth})...`);

		await this.page.goto('https://www.copart.com/auctionCalendar', {
			waitUntil: 'domcontentloaded',
			timeout: this.timeout,
		});

		console.log('Calendar page loaded, waiting for content...');
		await this.page.waitForTimeout(3000);

		// Try to wait for common link patterns to appear
		await this.page.waitForSelector('a[href*="saleListResult"], a[href*="auctionDashboard"]', { timeout: 8000 }).catch(() => {});

		// Save a snapshot of the raw HTML to help diagnose selectors if nothing is found
		try {
			const html = await this.page.content();
			const snapPath = './results/calendar_snapshot.html';
			fs.mkdirSync('./results', { recursive: true });
			fs.writeFileSync(snapPath, html);
			console.log(`Saved calendar snapshot to ${snapPath}`);
		} catch (e) {
			console.log('Could not save calendar snapshot:', e.message);
		}

		const auctions = await this.page.evaluate((monthName) => {
			const auctionList = [];

			const normalize = (s = '') => s.replace(/\s+/g, ' ').trim();
			const isMonthMatch = (text) => text.toLowerCase().includes(monthName.toLowerCase());

			const monthIndex =
				{
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
				}[monthName.toLowerCase()] ?? null;

			const isTargetMonthFromMs = (ms) => {
				if (!ms) return false;
				const d = new Date(Number(ms));
				return !isNaN(d) && d.getMonth() === monthIndex;
			};

			const isTargetMonthFromDateStr = (ds) => {
				if (!ds) return false;
				const d = new Date(ds);
				return !isNaN(d) && d.getMonth() === monthIndex;
			};

			// Strategy 1: direct anchors to saleListResult (most reliable)
			const links = Array.from(document.querySelectorAll('a[href*="saleListResult"], a[href*="auctionDashboard"], a[href*="viewSale"], a[data-url*="saleListResult"]'));
			links.forEach((link) => {
				const text = normalize(link.textContent || '');
				const dataUrl = link.getAttribute('data-url') || '';
				const href = link.getAttribute('href') || '';
				const fullHref = href.startsWith('http') ? href : `https://www.copart.com${href.replace(/^\./, '')}`;

				// Try to read saleDate from query param saleDate=ms or from path yyyy-mm-dd
				const urlForDate = dataUrl || href;
				const saleDateMsMatch = urlForDate.match(/saleDate=(\d{10,})/);
				const saleDatePathMatch = urlForDate.match(/saleListResult\/\d+\/(\d{4}-\d{2}-\d{2})/);
				const saleDateMs = saleDateMsMatch ? saleDateMsMatch[1] : '';
				const saleDatePath = saleDatePathMatch ? saleDatePathMatch[1] : '';

				const inMonth = monthIndex === null ? isMonthMatch(text) : isTargetMonthFromMs(saleDateMs) || isTargetMonthFromDateStr(saleDatePath) || isMonthMatch(text);
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

			// Strategy 2: fallback to table rows
			if (auctionList.length === 0) {
				const rowSelectors = ['table tbody tr', 'tbody tr', '.table tbody tr', '[role="row"]'];
				let rows = [];
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

	async scrapeAuctionCars(auctionUrl: string, carsPerPage: number = 20) {
		console.log(`  Navigating to auction page...`);
		await this.page.goto(auctionUrl, {
			waitUntil: 'domcontentloaded',
			timeout: this.timeout,
		});

		await this.page.waitForTimeout(2000);

		// Try to set cars per page to the specified amount
		const pageSize = await this.page.evaluate((itemsPerPage) => {
			// Look for pagination size selector
			const sizeSelectors = ['select[name*="size"]', 'select[name*="pageSize"]', 'select[name*="per"]', '[data-uname*="pageSize"]', '.items-per-page select'];

			for (const selector of sizeSelectors) {
				const element = document.querySelector(selector);
				if (element) {
					// Try to set to the specified items per page
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
			await this.page.waitForTimeout(2000);
		}

		const allCars = [];
		let pageNumber = 1;
		let hasMorePages = true;
		let maxPages = 999; // Much higher limit since we're paginating by 20 cars

		while (hasMorePages && pageNumber <= maxPages) {
			console.log(`  Extracting page ${pageNumber}...`);

			const carsOnPage = await this.page.evaluate(() => {
				const carList = [];

				// Try multiple selector patterns to find car rows/cards
				const selectors = ['[data-uname="lotsearchLotdetails"]', '.lot-details', 'div[data-lot-id]', 'tbody tr', '.vehicle-card', '.lot-row', '[data-uname*="lot"]'];

				let cards = [];
				for (const sel of selectors) {
					cards = document.querySelectorAll(sel);
					if (cards.length > 0) break;
				}

				cards.forEach((card) => {
					try {
						// Extract all text content
						const allText = card.textContent || '';
						const lines = allText
							.split('\n')
							.map((l) => l.trim())
							.filter((l) => l.length > 0);

						// Extract lot number (8+ digits or matches "Lot #XXXXX")
						let lotNumber = '';
						const lotMatch = allText.match(/(?:Lot\s*#?\s*)?(\d{8,})/i);
						if (lotMatch) lotNumber = lotMatch[1];

						// Try to extract from data attributes first
						lotNumber =
							lotNumber ||
							card.getAttribute('data-lot-id') ||
							card.getAttribute('data-uname')?.match(/\d{8,}/)?.[0] ||
							card.querySelector('[data-uname*="LotNumber"]')?.textContent?.trim() ||
							'';

						// Extract details link first (contains vehicle info in URL)
						const detailsLink = card.querySelector('a')?.href || '';

						// Parse vehicle info from URL if available
						// URL pattern: /lot/[lotNumber]/[title]-[year]-[make]-[model]-...-[location]
						let urlVehicleInfo = {
							year: '',
							make: '',
							model: '',
							title: '',
						};

						if (detailsLink) {
							const urlMatch = detailsLink.match(/\/lot\/\d+\/([a-z\d-]+)/i);
							if (urlMatch) {
								const urlPart = urlMatch[1];
								const parts = urlPart.split('-');

								// Try to find year (4 digits)
								const yearIdx = parts.findIndex((p) => /^\d{4}$/.test(p));
								if (yearIdx !== -1) {
									urlVehicleInfo.year = parts[yearIdx];
									if (yearIdx + 1 < parts.length) {
										urlVehicleInfo.make = parts[yearIdx + 1];
									}
									if (yearIdx + 2 < parts.length) {
										// Model could be multiple parts
										const modelParts = [];
										for (let i = yearIdx + 2; i < parts.length; i++) {
											// Stop at common location codes
											if (['ca', 'tx', 'fl', 'ny', 'wa', 'az', 'co', 'nm', 'uk', 'med', 'delivery', 'van', 'truck', 'sedan', 'suv'].includes(parts[i])) {
												break;
											}
											modelParts.push(parts[i]);
										}
										urlVehicleInfo.model = modelParts.join(' ');
									}
									urlVehicleInfo.title = [urlVehicleInfo.year, urlVehicleInfo.make, urlVehicleInfo.model].filter((v) => v).join(' ');
								}
							}
						}

						// Extract title/make/model - prefer URL data
						let title =
							urlVehicleInfo.title ||
							card.querySelector('[data-uname*="year-make-model"]')?.textContent?.trim() ||
							card.querySelector('.vehicle-name, .lot-title, h4')?.textContent?.trim() ||
							'';

						let year = urlVehicleInfo.year || card.querySelector('[data-uname*="year"]')?.textContent?.trim() || '';

						let make = urlVehicleInfo.make || card.querySelector('[data-uname*="make"]')?.textContent?.trim() || '';

						let model = urlVehicleInfo.model || card.querySelector('[data-uname*="model"]')?.textContent?.trim() || '';

						// If still no title, try to parse from text lines
						if (!title && lines.length > 0) {
							// Look for lines that contain vehicle info (usually start with year or make)
							for (let i = 0; i < lines.length; i++) {
								const line = lines[i];
								// Skip currency, "view", common words
								if (/^[A-Z]{3,}/.test(line) && !/^(USD|EUR|GBP|VIEW|SOLD|BID)/.test(line)) {
									title = line;
									break;
								}
							}
						}
						// Extract price/current bid
						let price =
							card.querySelector('[data-uname*="currentbid"]')?.textContent?.trim() || card.querySelector('.price, .current-bid, .bid')?.textContent?.trim() || '';

						// Search for price in text (pattern like $X,XXX or number with $ symbol)
						if (!price) {
							const priceMatch = allText.match(/\$[\d,]+(?:\.\d{2})?/);
							if (priceMatch) price = priceMatch[0];
						}

						// Extract damage description
						let damage = card.querySelector('[data-uname*="damage"]')?.textContent?.trim() || card.querySelector('.damage, .primary-damage')?.textContent?.trim() || '';

						// Search for common damage types in text
						if (!damage) {
							const damageTypes = [
								'Structural Damage',
								'Door Damage',
								'Water Damage',
								'Fire Damage',
								'Front End',
								'Rear End',
								'Side Damage',
								'Clean Title',
								'Lien',
								'Rebuilt',
							];
							for (const type of damageTypes) {
								if (allText.includes(type)) {
									damage = type;
									break;
								}
							}
						}

						// Extract odometer
						let odometer = card.querySelector('[data-uname*="odometer"]')?.textContent?.trim() || card.querySelector('.odometer, .mileage')?.textContent?.trim() || '';

						// Search for mileage pattern (numbers with "mi" or "km")
						if (!odometer) {
							const odoMatch = allText.match(/(\d{1,3}(?:,\d{3})*)\s*(?:mi|km|miles|kilometers)/i);
							if (odoMatch) odometer = odoMatch[1];
						}

						// Extract VIN
						let vin = card.querySelector('.vin, [data-uname*="vin"]')?.textContent?.trim() || '';
						if (!vin) {
							const vinMatch = allText.match(/VIN[:\s]+([A-HJ-NPR-Z0-9]{17})/i);
							if (vinMatch) vin = vinMatch[1];
						}

						// Extract image URL
						const imageUrl = card.querySelector('img')?.src || '';

						// Only add if we have at least a lot number or some identifying info
						if (lotNumber || title || price) {
							carList.push({
								lotNumber,
								title: title.trim(),
								price: price.trim(),
								damage: damage.trim(),
								odometer: odometer.trim(),
								year: year.trim(),
								make: make.trim(),
								model: model.trim(),
								vin: vin.trim(),
								imageUrl: imageUrl.trim(),
								detailsLink: detailsLink.trim(),
							});
						}
					} catch (e) {
						// Skip errors
					}
				});

				return carList;
			});

			allCars.push(...carsOnPage);
			console.log(`    Page ${pageNumber}: ${carsOnPage.length} cars`);

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
				// Wait for page to update after clicking
				await this.page.waitForTimeout(1500);
				pageNumber++;
			} else {
				hasMorePages = false;
			}
		}

		return allCars;
	}

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
					await this.page.waitForTimeout(1000);
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

	// Same as above but sources auctions from auctionCalendar and filters by month
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
					await this.page.waitForTimeout(1000);
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

	// Scrape a specific auction by direct URL
	async scrapeSpecificAuctionByUrl(auctionUrl: string, auctionName: string, autoSaveFilename: string | null = null) {
		console.log(`\nScraping specific auction: ${auctionName}`);
		console.log(`URL: ${auctionUrl}\n`);

		// Create results directory
		const resultsDir = './results';
		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir, { recursive: true });
		}

		// Scrape cars for this specific auction
		console.log(`Scraping cars...`);
		try {
			const cars = await this.scrapeAuctionCars(auctionUrl);
			console.log(`✓ Found ${cars.length} cars`);

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

	// Scrape a specific auction by location name
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

	// Quick save without fancy formatting - just update JSON and HTML
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

	async scrapeCopart(searchUrl: string) {
		console.log('Navigating to Copart...');
		await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: this.timeout });

		await this.page
			.waitForSelector('.vehicle-card, .item-card, [data-uname="lotsearchLotdetails"]', { timeout: 10000 })
			.catch(() => console.log('Warning: Standard selectors not found, trying alternative...'));

		const listings = await this.page.evaluate(() => {
			const cars = [];
			const cards = document.querySelectorAll('.vehicle-card, .item-card, [data-uname="lotsearchLotdetails"], .lot-details');

			cards.forEach((card) => {
				try {
					const car = {
						title: card.querySelector('.vehicle-name, .lot-title, h4, .year-make-model')?.textContent?.trim() || '',
						lotNumber: card.querySelector('.lot-number, [data-uname="lotsearchLotLotNumber"]')?.textContent?.trim() || '',
						year: card.querySelector('.year, .vehicle-year')?.textContent?.trim() || '',
						make: card.querySelector('.make, .vehicle-make')?.textContent?.trim() || '',
						model: card.querySelector('.model, .vehicle-model')?.textContent?.trim() || '',
						price: card.querySelector('.price, .current-bid, [data-uname="lotsearchLotcurrentbid"]')?.textContent?.trim() || '',
						damage: card.querySelector('.damage, .primary-damage')?.textContent?.trim() || '',
						odometer: card.querySelector('.odometer, .mileage')?.textContent?.trim() || '',
						location: card.querySelector('.location, .yard-location')?.textContent?.trim() || '',
						vin: card.querySelector('.vin')?.textContent?.trim() || '',
						imageUrl: card.querySelector('img')?.src || '',
						link: card.querySelector('a')?.href || '',
					};

					if (car.title || car.lotNumber) {
						cars.push(car);
					}
				} catch (e) {
					console.error('Error parsing card:', e);
				}
			});

			return cars;
		});

		console.log(`Found ${listings.length} listings`);
		this.results = this.results.concat(listings);
		return listings;
	}

	async scrapeIAAI(searchUrl: string) {
		console.log('Navigating to IAAI...');
		await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: this.timeout });

		await this.page.waitForSelector('.table-row, .search-result-item', { timeout: 10000 }).catch(() => console.log('Warning: Listings not found'));

		const listings = await this.page.evaluate(() => {
			const cars = [];
			const rows = document.querySelectorAll('.table-row, .search-result-item, tr.vehicle-row');

			rows.forEach((row) => {
				try {
					const car = {
						title: row.querySelector('.vehicle-desc, .title')?.textContent?.trim() || '',
						stockNumber: row.querySelector('.stock-number')?.textContent?.trim() || '',
						vin: row.querySelector('.vin')?.textContent?.trim() || '',
						year: row.querySelector('.year')?.textContent?.trim() || '',
						make: row.querySelector('.make')?.textContent?.trim() || '',
						model: row.querySelector('.model')?.textContent?.trim() || '',
						damage: row.querySelector('.damage-type')?.textContent?.trim() || '',
						odometer: row.querySelector('.odometer')?.textContent?.trim() || '',
						currentBid: row.querySelector('.current-bid, .price')?.textContent?.trim() || '',
						saleDate: row.querySelector('.sale-date')?.textContent?.trim() || '',
						location: row.querySelector('.location')?.textContent?.trim() || '',
						imageUrl: row.querySelector('img')?.src || '',
						link: row.querySelector('a')?.href || '',
					};

					if (car.title || car.stockNumber) {
						cars.push(car);
					}
				} catch (e) {
					console.error('Error parsing row:', e);
				}
			});

			return cars;
		});

		console.log(`Found ${listings.length} listings`);
		this.results = this.results.concat(listings);
		return listings;
	}

	async scrapeCustom(url: string, selectors: any) {
		console.log(`Navigating to ${url}...`);
		await this.page.goto(url, { waitUntil: 'networkidle2', timeout: this.timeout });

		if (selectors.waitFor) {
			await this.page.waitForSelector(selectors.waitFor, { timeout: 10000 }).catch(() => console.log('Warning: Wait selector not found'));
		}

		const listings = await this.page.evaluate((sel) => {
			const cars: Record<string, any>[] = [];
			const items = document.querySelectorAll(sel.itemSelector);

			items.forEach((item) => {
				const car: Record<string, any> = {};

				Object.keys(sel.fields).forEach((field) => {
					const element = item.querySelector(sel.fields[field]);
					car[field] = element ? element.textContent.trim() : '';
				});

				const img = item.querySelector(sel.imageSelector || 'img');
				car.imageUrl = img ? img.src : '';

				const link = item.querySelector(sel.linkSelector || 'a');
				car.link = link ? link.href : '';

				cars.push(car);
			});

			return cars;
		}, selectors);

		console.log(`Found ${listings.length} listings`);
		this.results = this.results.concat(listings);
		return listings;
	}

	async scrollToLoadMore(scrolls: number = 3) {
		console.log('Scrolling to load more content...');
		for (let i = 0; i < scrolls; i++) {
			await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await this.page.waitForTimeout(2000);
		}
	}

	async saveResults(filename: string = 'car_auction_results.json') {
		// Create results directory with full path
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
		const absoluteHtmlPath = path.resolve(htmlPath);

		console.log(`Saving HTML to: ${absoluteHtmlPath}`);
		this.saveHTMLReport(htmlPath);

		return absoluteFilepath;
	}

	saveHTMLReport(filepath: string) {
		const isAuctionFormat = this.results.length > 0 && this.results[0].hasOwnProperty('cars');
		let html = '';

		if (isAuctionFormat) {
			const totalCars = this.results.reduce((sum, auction) => sum + (auction.cars?.length || 0), 0);

			html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Today's Auctions Report</title>
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
    <h1>🚗 Today's Auctions - ${new Date().toLocaleDateString()}</h1>
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
                            ${car.saleStatus ? `<div class="car-detail"><strong>Status:</strong> ${car.saleStatus}</div>` : ''}
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
    <title>Car Auction Results</title>
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
    <h1>🚗 Car Auction Results</h1>
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
                ${car.lotNumber || car.stockNumber ? `<div class="car-detail">Lot: ${car.lotNumber || car.stockNumber}</div>` : ''}
                ${car.vin ? `<div class="car-detail">VIN: ${car.vin}</div>` : ''}
                ${car.price || car.currentBid ? `<div class="price">${car.price || car.currentBid}</div>` : ''}
                ${car.damage ? `<div class="car-detail">Damage: ${car.damage}</div>` : ''}
                ${car.odometer ? `<div class="car-detail">Odometer: ${car.odometer}</div>` : ''}
                ${car.location ? `<div class="car-detail">Location: ${car.location}</div>` : ''}
                ${car.link ? `<a href="${car.link}" class="link" target="_blank">View Listing →</a>` : ''}
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
	const scraper = new CarAuctionScraper({ headless: false });

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
			console.error('Error closing browser:', closeError.message);
		}
	}
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
	main().catch(console.error);
}

export default CarAuctionScraper;
