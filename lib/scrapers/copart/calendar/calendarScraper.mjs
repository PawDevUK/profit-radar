import { saveResults, closeBrowser, debugDump, debugDOMSummary } from '@/lib/scrapers/copart/calendar/lib/calendar_helpers';
import 'dotenv/config';
const copartCalendarUrl = process.env.COPART_CALENDAR_URL;
import { createContext } from '../../proxy/createContext';

export async function scrapeCopartCalendar(targetMonth, options = {}) {
    const ctx = await createContext(options);
    const { browser, page } = ctx;
    try {
        console.log(`Navigating to Copart auction calendar (month: ${targetMonth})...`);
        await page.goto(copartCalendarUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Target reachable:', copartCalendarUrl);

        // Handle common cookie banners if present (best-effort)
        try {
            const cookieSelectors = [
                '#onetrust-accept-btn-handler',
                'button[aria-label="Accept All"]',
                'button[aria-label="Accept all"]'
            ];
            for (const sel of cookieSelectors) {
                const btn = await page.$(sel);
                if (btn) {
                    await btn.click({ delay: 50 });
                    console.log('Cookie consent dismissed');
                    break;
                }
            }
        } catch { /* ignore */ }

        // Give the page some time to fetch dynamic content
        await new Promise((r) => setTimeout(r, 3000));

        // Attempt to scroll to trigger lazy content if any (window and scrollable containers)
        async function progressiveScrollAll() {
            try {
                await page.evaluate(async () => {
                    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
                    for (let iter = 0; iter < 3; iter++) {
                        // Scroll window
                        for (let y = 0; y <= document.body.scrollHeight; y += 600) {
                            window.scrollTo(0, y);
                            await sleep(60);
                        }
                        // Scroll any overflow containers
                        const nodes = Array.from(document.querySelectorAll('*'));
                        for (const el of nodes) {
                            const anyEl = el;
                            if (anyEl && anyEl.scrollHeight && anyEl.clientHeight && anyEl.scrollHeight > anyEl.clientHeight) {
                                anyEl.scrollTop = anyEl.scrollHeight;
                                await sleep(30);
                            }
                        }
                    }
                    window.scrollTo(0, 0);
                });
            } catch { /* ignore */ }
        }

        await page
            .waitForSelector('a[href*="saleListResult"], a[href*="auctionDashboard"], a[data-url*="saleListResult"]', { timeout: 20000 })
            .catch(() => { });

        // Helper to extract auctions from the current view
        const extractAuctions = async () => {
            return await page.evaluate((monthName) => {
                const auctionList = [];
                const normalize = (s = '') => s.replace(/\s+/g, ' ').trim();
                const isMonthMatch = (text) => text.toLowerCase().includes(monthName.toLowerCase());

                const monthIndex = {
                    january: 0, february: 1, march: 2, april: 3,
                    may: 4, june: 5, july: 6, august: 7,
                    september: 8, october: 9, november: 10, december: 11
                };

                const targetMonthIndex = monthIndex[monthName.toLowerCase()] ?? null;

                const isTargetMonthFromMs = (ms) => {
                    if (!ms) return false;
                    const d = new Date(parseInt(ms));
                    return !isNaN(d.getTime()) && d.getMonth() === targetMonthIndex;
                };

                const isTargetMonthFromDateStr = (ds) => {
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

                    // Extract location from URL parameter (more reliable)
                    let location = '';
                    const locationMatch = fullHref.match(/location=([^&]+)/);
                    if (locationMatch) {
                        location = decodeURIComponent(locationMatch[1]).replace(/\*/g, '');
                    }
                    // Fallback to cells or link text
                    if (!location) {
                        location = cells[0] || text || link.title || link.getAttribute('aria-label') || '';
                    }

                    const saleDate = saleDatePath || saleDateMs || cells.find((t) => /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(t)) || text;
                    const saleTime = cells.find((t) => /am|pm|\d{1,2}:\d{2}/i.test(t)) || '';

                    // Extract number of lots from the text or cells
                    let numberOnSale = null;

                    if (location && link.href) {
                        auctionList.push({
                            location,
                            saleDate,
                            saleTime,
                            viewSalesLink: fullHref,
                            numberOnSale,
                        });
                    }
                });

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
                            const viewSalesLink = linkEl?.getAttribute('href') || '';

                            if (location && viewSalesLink) {
                                auctionList.push({
                                    location,
                                    saleDate,
                                    saleTime: cellText[3] || '',
                                    viewSalesLink: viewSalesLink.startsWith('http') ? viewSalesLink : `https://www.copart.com${viewSalesLink}`,
                                });
                            }
                        } catch {
                            // Skip row errors
                        }
                    });
                }
                return auctionList;

            }, targetMonth);
        };

        // Try to reveal all weeks within the month by scrolling and clicking next controls
        const seen = new Set();
        let allAuctions = [];

        const addUnique = (items) => {
            let added = 0;
            for (const it of items) {
                const key = `${it.viewSalesLink}|${it.location}|${it.saleDate}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    allAuctions.push(it);
                    added++;
                }
            }
            return added;
        };

        const tryClickNext = async () => {
            const nextSelectors = [
                'button[aria-label="Next"]',
                '.fc-next-button',
                'button[title="Next"]',
                '.calendar .next',
            ];
            for (const sel of nextSelectors) {
                const handle = await page.$(sel);
                if (handle) {
                    try {
                        await handle.click();
                        await new Promise((r) => setTimeout(r, 800));
                        return true;
                    } catch { /* try next */ }
                }
            }
            // Try clicking any button with text like "Next" or "More"
            try {
                const clicked = await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button, a'));
                    for (const b of buttons) {
                        const t = (b.textContent || '').trim();
                        if (/^(next|more|show more|load more)$/i.test(t)) {
                            b.click();
                            return true;
                        }
                    }
                    return false;
                });
                if (clicked) {
                    await new Promise((r) => setTimeout(r, 800));
                    return true;
                }
            } catch { /* ignore */ }
            return false;
        };

        // Initial reveal + extract
        await progressiveScrollAll();
        let batch = await extractAuctions();
        addUnique(batch);

        // Iterate through possible additional weeks/pages within the month
        for (let i = 0; i < 8; i++) {
            const clicked = await tryClickNext();
            if (!clicked) break;
            await progressiveScrollAll();
            batch = await extractAuctions();
            const added = addUnique(batch);
            if (added === 0) {
                // No growth; likely moved past last week or layout unchanged
                break;
            }
        }

        const auctions = allAuctions;

        console.log(`Found ${auctions.length} ${targetMonth} auctions from calendar`);
        if (!auctions || auctions.length === 0) {
            console.warn('No auctions detected – writing debug artifacts...');
            await debugDump(page, `calendar-${monthNameToFile(targetMonth)}`);
            await debugDOMSummary(page, `calendar-${monthNameToFile(targetMonth)}`);
        }
        await saveResults(auctions, `calendar_${monthNameToFile(targetMonth)}.json`);
        return auctions;
    } catch (err) {
        console.error('Calendar scrape failed:', err);
        throw err;
    } finally {
        await closeBrowser(browser);
    }
}

function monthNameToFile(m) {
    return String(m).replace(/\s+/g, '_');
}

