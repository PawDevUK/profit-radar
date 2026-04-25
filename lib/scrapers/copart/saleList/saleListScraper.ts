import { type GoToOptions } from 'puppeteer';
import { createContext } from '@/lib/scrapers/proxy/createContext';
import scrapeLot from '../lot/lotScraper';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};
export default async function saleListScraper(saleUrl: string, scrapedListSizeNum: number | null) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	let browser: { close: () => Promise<void> } | null = null;
	try {
		if (saleUrl) {
			const ctx = await createContext(options);
			browser = ctx.browser;
			const salesPage = ctx.page;
			await salesPage.goto(saleUrl, pageOptions);
			await salesPage.waitForSelector('a[aria-label="Lot Details"]', { timeout: 30000 });
			const saleUrls: string[] = [];
			while (true) {
				const lotUrlsOnPage = await salesPage.$$eval('a[aria-label="Lot Details"]', (anchors) => anchors.map((a) => (a as HTMLAnchorElement).href).filter(Boolean));
				saleUrls.push(...lotUrlsOnPage);

				if (scrapedListSizeNum !== null && saleUrls.length >= scrapedListSizeNum) {
					break;
				}

				const firstLotHref = lotUrlsOnPage[0] ?? null;

				// Bring paginator into view - on this page Next may only become actionable after scrolling down.
				await salesPage.evaluate(() => {
					window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior });
				});

				const nextButton = await salesPage.$('button[aria-label="Next Page"].p-paginator-next.p-link:not(.p-disabled)');
				if (!nextButton) {
					break;
				}

				await nextButton.evaluate((el) => {
					(el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' });
				});

				await nextButton.click();

				if (firstLotHref) {
					await salesPage.waitForFunction(
						(prevHref: string) => {
							const firstLink = document.querySelector('a[aria-label="Lot Details"]') as HTMLAnchorElement | null;
							return !!firstLink && firstLink.href !== prevHref;
						},
						{ timeout: 45000 },
						firstLotHref,
					);
				} else {
					await salesPage.waitForSelector('a[aria-label="Lot Details"]', { timeout: 45000 });
				}

				await salesPage.evaluate(() => {
					window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
				});

				if (scrapedListSizeNum !== null && saleUrls.length >= scrapedListSizeNum) {
					break;
				}
			}
			const scrapedSaleList = await scrapeLot(scrapedListSizeNum ? saleUrls.slice(0, scrapedListSizeNum) : saleUrls);
			return scrapedSaleList;
		}
	} catch (e) {
		console.log(e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}
