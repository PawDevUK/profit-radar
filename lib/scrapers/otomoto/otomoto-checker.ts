import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Note: Using puppeteer with stealth bypass via launch args instead of plugin

export type Car = {
	lotNumber: string;
	title: string;
	year: string;
	make: string;
	model: string;
	price: string;
	buyItNowPrice?: string;
	damage: string;
	odometer: string;
	vin: string;
	imageUrl: string;
	images?: string[];
	detailsLink: string;
	bodyType?: string;
	color?: string;
	transmission?: string;
	titleCode?: string;
	engineStarts?: string;
	transmissionEngages?: string;
	hasKey?: string;
	highlights?: string[];
	notes?: string;
};

export type OtomotoCheckResult = {
	lotNumber: string;
	title: string;
	make: string;
	model: string;
	searchQuery: string;
	found: boolean;
	foundCount?: number;
	url?: string;
	error?: string;
};

export type OtomotoListingCheck = {
	make: string;
	model: string;
	year: string;
	odometer: string;
	listed_otomoto: boolean;
	listing_count?: number;
	lotNumber: string;
	checkedAt: string;
};

/**
 * Extract make and model from car title
 * Example: "2014 FORD E150 UTILITY / SERVICE VAN" -> make: "FORD", model: "E150"
 */
function extractMakeModel(title: string): { make: string; model: string } {
	const parts = title.trim().split(/\s+/);

	// Skip year (first part is usually year)
	let make = '';
	let model = '';

	if (parts.length >= 3) {
		// parts[0] is year, parts[1] should be make, parts[2] should be model
		make = parts[1].toUpperCase();
		model = parts[2].toUpperCase();
	}

	return { make, model };
}

/**
 * Load cars from the copart detailed JSON file
 */
export async function loadCopartCars(): Promise<Car[]> {
	try {
		const filePath = path.join(process.cwd(), 'results', 'copart_first_page_detailed_2026-01-28.json');
		const fileContents = fs.readFileSync(filePath, 'utf8');
		const cars = JSON.parse(fileContents);

		if (!Array.isArray(cars)) {
			throw new Error('Data is not an array');
		}

		return cars as Car[];
	} catch (error) {
		console.error('Error loading Copart cars:', error);
		throw error;
	}
}

/**
 * Build Otomoto search URL for a car
 * URL format: https://www.otomoto.pl/osobowe/[make]/[model]
 * Example: https://www.otomoto.pl/osobowe/audi/q3
 */
function buildOtomotoSearchUrl(make: string, model: string): string {
	// Format: /osobowe/[make-lowercase]/[model-lowercase]
	// Replace spaces with hyphens
	const makePath = make.trim().toLowerCase().replace(/\s+/g, '-');
	const modelPath = model.trim().toLowerCase().replace(/\s+/g, '-');
	return `https://www.otomoto.pl/osobowe/${makePath}/${modelPath}`;
}

/**
 * Verify if a car exists on otomoto.pl by searching for it
 * Uses the direct URL structure: /osobowe/[make]/[model]
 * Example: https://www.otomoto.pl/osobowe/audi/q3
 *
 * Extracts listing count from search results page
 * Desktop version provides more reliable count extraction
 */
export async function verifyCarOnOtomoto(make: string, model: string): Promise<{ found: boolean; count: number }> {
	try {
		const browser = await puppeteer.launch({
			headless: false,
			args: ['--disable-blink-features=AutomationControlled', '--disable-web-resources'],
		});
		const page = await browser.newPage();

		// Set desktop viewport for better results display
		await page.setViewport({ width: 1280, height: 800 });

		// Set a desktop user agent
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

		try {
			// Navigate to base Otomoto page
			await page.goto('https://www.otomoto.pl/osobowe', { waitUntil: 'networkidle2', timeout: 30000 });

			await new Promise((resolve) => setTimeout(resolve, 2000));

			console.log(`\n=== Verifying ${make} ${model} (desktop) ===`);

			// CORRECT Workflow:
			// 1. Click 'Marka pojazdu' input
			// 2. Type make (e.g., lexus)
			// 3. Click the make option from dropdown (automatically checks checkbox)
			// 4. Click outside
			// 5. Click 'Model pojazdu' input (SEPARATE from Marka!)
			// 6. Type model (e.g., ls)
			// 7. Click the model option from dropdown (automatically checks checkbox)
			// 8. Click outside
			// 9. Extract count

			console.log('Step 1: Clicking Marka pojazdu input...');
			const makeInput = await page.$('input[placeholder="Marka pojazdu"]');
			if (!makeInput) {
				console.log('Make input not found');
				await browser.close();
				return { found: false, count: 0 };
			}

			await makeInput.click();
			await new Promise((resolve) => setTimeout(resolve, 600));

			console.log(`Step 2: Typing make: ${make}`);
			await page.type('input[placeholder="Marka pojazdu"]', make, { delay: 100 });
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Step 3: Click the make option from dropdown
			console.log('Step 3: Clicking make option from dropdown...');
			const makeOptionClicked = await page.evaluate((makeName: string) => {
				const options = Array.from(document.querySelectorAll('[role="option"]'));
				for (const option of options) {
					const text = option.textContent?.trim() || '';
					if (text.toUpperCase().includes(makeName.toUpperCase())) {
						(option as HTMLElement).click();
						return true;
					}
				}
				return false;
			}, make);

			if (!makeOptionClicked) {
				console.log('Make option not found in dropdown');
				await browser.close();
				return { found: false, count: 0 };
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Step 4: Click outside
			console.log('Step 4: Clicking outside...');
			await page.click('body', { offset: { x: 100, y: 100 } });
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Step 5: Click 'Model pojazdu' (DIFFERENT input!)
			console.log('Step 5: Clicking Model pojazdu input...');
			const modelInput = await page.$('input[placeholder="Model pojazdu"]');
			if (!modelInput) {
				console.log('Model input not found');
				await browser.close();
				return { found: false, count: 0 };
			}

			await modelInput.click();
			await new Promise((resolve) => setTimeout(resolve, 600));

			console.log(`Step 6: Typing model: ${model}`);
			await page.type('input[placeholder="Model pojazdu"]', model, { delay: 100 });
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Step 7: Click the model option from dropdown
			console.log('Step 7: Clicking model option from dropdown...');
			const modelOptionClicked = await page.evaluate((modelName: string) => {
				const options = Array.from(document.querySelectorAll('[role="option"]'));
				for (const option of options) {
					const text = option.textContent?.trim() || '';
					if (text.toUpperCase().includes(modelName.toUpperCase())) {
						(option as HTMLElement).click();
						return true;
					}
				}
				return false;
			}, model);

			if (!modelOptionClicked) {
				// Log available options for debugging
				const availableOptions = await page.evaluate(() => {
					const opts = Array.from(document.querySelectorAll('[role="option"]'));
					return opts.map((o) => o.textContent?.trim() || '');
				});
				console.log(`Model "${model}" not found in dropdown`);
				console.log(`Available options: ${availableOptions.slice(0, 5).join(', ')}`);
				await browser.close();
				return { found: false, count: 0 };
			}

			// Step 9: Extract count BEFORE clicking outside (options disappear after clicking outside!)
			console.log('Step 9: Extracting count from dropdown...');
			const count = await page.evaluate((modelName: string) => {
				const options = Array.from(document.querySelectorAll('[role="option"]'));
				if (!options || options.length === 0) {
					return 0;
				}
				for (const option of options) {
					const text = option.textContent?.trim() || '';
					if (text.toUpperCase().includes(modelName.toUpperCase())) {
						// Extract count from format "MODEL (count)"
						const match = text.match(/\((\d+)\)/);
						if (match) {
							return parseInt(match[1], 10);
						}
					}
				}
				return 0;
			}, model);

			// Now click outside
			console.log('Step 8: Clicking outside...');
			await page.click('body', { offset: { x: 100, y: 100 } });
			await new Promise((resolve) => setTimeout(resolve, 1500));

			console.log(`Found ${count} listings for ${make} ${model}`);
			await browser.close();
			return { found: count > 0, count };
		} catch (error) {
			console.error(`Error during verification: ${error}`);
			await browser.close();
			return { found: false, count: 0 };
		}
	} catch (error) {
		console.error(`Error verifying ${make} ${model}:`, error);
		return { found: false, count: 0 };
	}
}

/**
 * Check if a car exists on otomoto.pl
 * Note: This function returns the search URL. Actual verification would require
 * web scraping or using Otomoto API if available.
 */
export async function checkCarOnOtomoto(make: string, model: string): Promise<{ url: string; searchQuery: string }> {
	const searchQuery = `${make} ${model}`.trim();
	const url = buildOtomotoSearchUrl(make, model);

	return {
		url,
		searchQuery,
	};
}

/**
 * Check all cars from Copart data against Otomoto and save results
 * Verifies each car's listing status and saves to otomoto_listing_check.json
 */
export async function checkAllCarsAndSaveToFile(): Promise<OtomotoListingCheck[]> {
	try {
		const cars = await loadCopartCars();
		const results: OtomotoListingCheck[] = [];
		const timestamp = new Date().toISOString();

		console.log(`Checking ${cars.length} cars on Otomoto.pl...`);

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i];
			try {
				console.log(`[${i + 1}/${cars.length}] Checking ${car.make} ${car.model}...`);

				// Verify on Otomoto
				const verification = await verifyCarOnOtomoto(car.make, car.model);

				const listingCheck: OtomotoListingCheck = {
					make: car.make,
					model: car.model,
					year: car.year,
					odometer: car.odometer,
					listed_otomoto: verification.found,
					listing_count: verification.count,
					lotNumber: car.lotNumber,
					checkedAt: timestamp,
				};

				results.push(listingCheck);
				console.log(`  → ${verification.found ? '✓ FOUND' : '✗ NOT FOUND'} (${verification.count} listings)`);
			} catch (error) {
				console.error(`  → Error checking ${car.make} ${car.model}:`, error);

				const listingCheck: OtomotoListingCheck = {
					make: car.make,
					model: car.model,
					year: car.year,
					odometer: car.odometer,
					listed_otomoto: false,
					listing_count: 0,
					lotNumber: car.lotNumber,
					checkedAt: timestamp,
				};

				results.push(listingCheck);
			}

			// Add delay between requests to avoid overwhelming the server
			if (i < cars.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}
		}

		// Save to file
		const filePath = path.join(process.cwd(), 'results', 'otomoto_listing_check.json');
		fs.writeFileSync(filePath, JSON.stringify(results, null, '\t'), 'utf8');

		console.log(`\n✓ Results saved to: ${filePath}`);
		console.log(`\nSummary:`);
		const foundCount = results.filter((r) => r.listed_otomoto).length;
		console.log(`  Total cars: ${results.length}`);
		console.log(`  Found on Otomoto: ${foundCount}`);
		console.log(`  Not found: ${results.length - foundCount}`);

		return results;
	} catch (error) {
		console.error('Error checking all cars:', error);
		throw error;
	}
}

/**
 * Check all cars from Copart data against Otomoto
 */
export async function checkAllCarsOnOtomoto(): Promise<OtomotoCheckResult[]> {
	try {
		const cars = await loadCopartCars();
		const results: OtomotoCheckResult[] = [];

		for (const car of cars) {
			try {
				// Extract make/model from title
				const { make: extractedMake, model: extractedModel } = extractMakeModel(car.title);

				// Use extracted make/model, fallback to stored if available
				const make = extractedMake || car.make;
				const model = extractedModel || car.model;

				// Verify on Otomoto
				const verification = await verifyCarOnOtomoto(make, model);
				const otomotoResult = await checkCarOnOtomoto(make, model);

				results.push({
					lotNumber: car.lotNumber,
					title: car.title,
					make,
					model,
					searchQuery: otomotoResult.searchQuery,
					found: verification.found,
					foundCount: verification.count,
					url: otomotoResult.url,
				});
			} catch (error) {
				results.push({
					lotNumber: car.lotNumber,
					title: car.title,
					make: car.make,
					model: car.model,
					searchQuery: `${car.make} ${car.model}`,
					found: false,
					error: error instanceof Error ? error.message : 'Unknown error',
				});
			}
		}

		return results;
	} catch (error) {
		console.error('Error checking cars on Otomoto:', error);
		throw error;
	}
}
