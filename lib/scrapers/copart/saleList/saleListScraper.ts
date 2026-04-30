import { type GoToOptions } from 'puppeteer';
import { createContext } from '@/lib/scrapers/proxy/createContext';
// import scrapeLot from '../lot/lotScraper';
import { AILotScraper } from '@/lib/scrapers/copart/lot/AI_LotScraper/AILotScraper';
import scrapeLotImages from '@/lib/scrapers/copart/lot/scrapeLotImages';
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
			await salesPage.waitForSelector('a[aria-label="Lot Details"]', { timeout: 10000 });
			const saleUrls: string[] = [];
			const consentSelector = 'button[aria-label="Consent"].fc-button.fc-cta-consent.fc-primary-button';
			const nextPageSelector = 'button[aria-label="Next Page"].p-paginator-next.p-link';
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
				const consentButton = await salesPage.$(consentSelector);
				if (consentButton) {
					await consentButton.click();
					await salesPage.waitForSelector(consentSelector, { hidden: true, timeout: 5000 }).catch(() => null);
				}

				const nextButton = await salesPage.$(`${nextPageSelector}:not(.p-disabled)`);

				if (!nextButton) {
					break;
				}

				await nextButton.evaluate((el) => {
					(el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' });
				});

				const clickedNext = await salesPage.evaluate((selector) => {
					const button = document.querySelector(selector) as HTMLButtonElement | null;
					if (!button) {
						return false;
					}

					const isDisabled = button.disabled || button.classList.contains('p-disabled') || button.getAttribute('aria-disabled') === 'true';
					if (isDisabled) {
						return false;
					}

					button.scrollIntoView({ block: 'center', inline: 'nearest' });
					button.click();
					return true;
				}, nextPageSelector);

				if (!clickedNext) {
					break;
				}

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
			// const scrapedSaleList = await scrapeLotImages(scrapedListSizeNum ? saleUrls.slice(0, scrapedListSizeNum) : saleUrls);
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
