// @ts-nocheck
import type WebScraper from '../scraper';
import { ISiteAdapter } from '../scraper';

/**
 * Otomoto Adapter - Handles scraping for Otomoto listing site
 * Implements listing-specific scraping methods
 */
export class OtomotoAdapter implements ISiteAdapter {
	getName(): string {
		return 'Otomoto';
	}

	/**
	 * Scrape listings from Otomoto
	 * Customize this method for your specific Otomoto scraping needs
	 */
	async scrapeListings(scraper: WebScraper, url: string): Promise<any[]> {
		console.log(`Scraping Otomoto listings from: ${url}`);
		await scraper.navigateTo(url);

		// Wait for listings to load
		try {
			await scraper.page.waitForSelector('[data-testid="search-listing"], .ooa-1u0wrx0', { timeout: 10000 });
		} catch (e) {
			console.log('Timeout waiting for listings, continuing anyway...');
		}

		const listings = await scraper.page.evaluate(() => {
			const listingList: any[] = [];

			// Try multiple selectors to find listing cards
			const selectors = [
				'[data-testid="search-listing"]',
				'.ooa-1u0wrx0',
				'article[data-id]',
				'.listing-item',
				'li[data-testid="search-listing-item"]',
				'.listing',
				'[role="article"]',
			];

			let cards: NodeListOf<Element> | undefined = undefined;

			for (const sel of selectors) {
				if (sel && sel.trim()) {
					try {
						const found = document.querySelectorAll(sel);
						if (found.length > 0) {
							cards = found;
							console.log(`Found ${found.length} cards with selector: ${sel}`);
							break;
						}
					} catch (e) {
						// Selector didn't match, try next
					}
				}
			}

			if (!cards || cards.length === 0) {
				console.log('No listing cards found. Available elements:');
				// Log what's on the page for debugging
				const allElements = document.querySelectorAll('li, article, div[class*="listing"], div[class*="offer"]');
				console.log(`Found ${allElements.length} potential elements`);
				cards = allElements;
			}

			cards.forEach((card) => {
				try {
					// Get link to listing
					const link = card.querySelector('a[href*="/oferta/"]') || card.querySelector('a') || card;
					const url = (link as HTMLElement).getAttribute?.('href') || (link as HTMLAnchorElement).href || '';

					if (!url && !(link as HTMLAnchorElement).href) return; // Skip if no URL

					// Get title (make/model/year)
					const titleEl =
						card.querySelector('[data-testid="listing-title"]') ||
						card.querySelector('.ooa-1ij0wq0') ||
						card.querySelector('h2') ||
						card.querySelector('h3') ||
						card.querySelector('[class*="title"]');
					const title = titleEl?.textContent?.trim() || '';

					// Get price
					const priceEl = card.querySelector('[data-testid="listing-price"]') || card.querySelector('.ooa-o4z5sf') || card.querySelector('[class*="price"]');
					const price = priceEl?.textContent?.trim() || '';

					// Get location
					const locationEl = card.querySelector('[data-testid="listing-location"]') || card.querySelector('[class*="location"]') || card.querySelector('[class*="city"]');
					const location = locationEl?.textContent?.trim() || '';

					// Get mileage
					const mileageEl =
						card.querySelector('[data-testid="listing-mileage"]') || Array.from(card.querySelectorAll('span')).find((el) => el.textContent?.includes('km'));
					const mileage = mileageEl?.textContent?.trim() || '';

					// Get year
					const yearEl =
						card.querySelector('[data-testid="listing-year"]') || Array.from(card.querySelectorAll('span')).find((el) => /^\d{4}$/.test(el.textContent?.trim() || ''));
					const year = yearEl?.textContent?.trim() || '';

					// Get image
					const imgEl = card.querySelector('img');
					const imageUrl = imgEl?.src || imgEl?.getAttribute('data-src') || '';

					// Only add if we have at least title or price
					if ((title && title.length > 2) || (price && price.length > 2)) {
						listingList.push({
							title: title || 'Unknown',
							price: price || 'N/A',
							location,
							mileage,
							year,
							imageUrl,
							url: url || '',
						});
					}
				} catch (e) {
					// Skip this card
				}
			});

			return listingList;
		});

		console.log(`Found ${listings.length} listings`);
		return listings;
	}
}
