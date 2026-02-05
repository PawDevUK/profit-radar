import fs from 'fs';
import puppeteer from 'puppeteer';
import { proxyConfig } from '@/lib/scrapers/proxy/proxy-config.ts';
const copartCalendarUrl = 'https://www.copart.com/auctionCalendar';

/**
 * CopartCalendarScraper - Scrapes auction schedules from Copart's auction calendar
 * Focuses solely on fetching auction metadata (dates, locations, URLs)
 */
export class CopartCalendarScraper {
    constructor() {
        this.headless = proxyConfig.headless;
        this.timeout = proxyConfig.timeout;
        this.captchaWaitTime = proxyConfig.captchaWaitTime;
        this.browser = null;
        this.page = null;
        this.proxy = proxyConfig;
    }

    /**
     * Initialize browser and page with anti-detection measures
     */
    async initialize() {
        if (this.proxy?.enabled) {
            console.log(`Launching browser for calendar scraper with proxy: ${this.proxy.server}`);
        } else {
            console.log('Launching browser for calendar scraper...');
        }

        const launchArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled',
            '--disable-web-resources',
            '--disable-extensions',
        ];

        // Add proxy args if configured - use proper format
        if (this.proxy?.enabled && this.proxy?.server) {
            try {
                const serverUrl = new URL(this.proxy.server);
                if (this.proxy?.username && this.proxy?.password) {
                    // Embed credentials if supported by Chromium
                    serverUrl.username = this.proxy.username;
                    serverUrl.password = this.proxy.password;
                }
                launchArgs.push(`--proxy-server=${serverUrl.toString()}`);
            } catch (e) {
                launchArgs.push(`--proxy-server=${this.proxy.server}`);
            }
        }

        console.log(`Headless mode: ${this.headless ? 'true' : 'false'}`);
        this.browser = await puppeteer.launch({
            headless: this.headless,
            args: launchArgs,
        });

        this.page = await this.browser.newPage();

        // Network diagnostics: log failed requests and error responses
        this.page.on('requestfailed', (req) => {
            const failure = req.failure();
            console.log(`[requestfailed] ${failure?.errorText || 'unknown'} - ${req.url()}`);
        });
        this.page.on('response', (res) => {
            const status = res.status();
            if (status >= 400) {
                console.log(`[response] ${status} - ${res.url()}`);
            }
        });

        // Network diagnostics: log failed requests and error responses
        this.page.on('requestfailed', (req) => {
            const failure = req.failure();
            console.log(`[requestfailed] ${failure?.errorText || 'unknown'} - ${req.url()}`);
        });
        this.page.on('response', (res) => {
            const status = res.status();
            if (status >= 400) {
                console.log(`[response] ${status} - ${res.url()}`);
            }
        });

        // Authenticate proxy if credentials provided
        if (this.proxy?.enabled && this.proxy?.username && this.proxy?.password) {
            try {
                await this.page.authenticate({
                    username: this.proxy.username,
                    password: this.proxy.password,
                });
                console.log('  ✓ Proxy authentication configured');
            } catch (error) {
                console.log(`  ⚠️  Proxy authentication failed: ${error.message}`);
                // Keep proxy enabled but warn; some proxies require credential-embedded server URL
            }
        }

        await this.page.setViewport({ width: 1920, height: 1080 });

        // Set realistic headers to avoid bot detection
        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

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

        // Quick proxy routing test: check current IP
        if (this.proxy?.enabled) {
            try {
                const ipRes = await this.page.goto('https://httpbin.org/ip', { waitUntil: 'domcontentloaded', timeout: Math.min(this.timeout, 10000) });
                if (ipRes && ipRes.status() === 407) {
                    console.log('  ⚠️  Proxy IP check returned 407 (authentication required).');
                }
                const ipText = await this.page.evaluate(() => document.body.textContent || '');
                console.log(`  ✓ Proxy IP check: ${ipText}`);
            } catch (e) {
                console.log(`  ⚠️  Proxy IP check failed: ${e.message}`);
            }
        }

        // Quick proxy routing test: check current IP
        if (this.proxy?.enabled) {
            try {
                await this.page.goto('https://httpbin.org/ip', { waitUntil: 'domcontentloaded', timeout: 10000 });
                const ipText = await this.page.evaluate(() => document.body.textContent || '');
                console.log(`  ✓ Proxy IP check: ${ipText}`);
            } catch (e) {
                console.log(`  ⚠️  Proxy IP check failed: ${e.message}`);
            }
        }
    }

    /**
     * Check for CAPTCHA and wait for manual solving
     */
    async checkAndHandleCaptcha() {
        const hasCaptcha = await this.page.evaluate(() => {
            return !!(
                document.querySelector('iframe[src*="captcha"]') ||
                document.querySelector('iframe[src*="recaptcha"]') ||
                document.querySelector('.g-recaptcha') ||
                document.querySelector('#captcha') ||
                document.body.innerText.includes('verify you are human') ||
                document.body.innerText.includes('CAPTCHA')
            );
        });

        if (hasCaptcha) {
            console.log('\n⚠️  CAPTCHA detected! Please solve it manually in the browser...');
            const waitSeconds = Math.ceil(this.captchaWaitTime / 1000);
            console.log(`⏳ Waiting ${waitSeconds} seconds for you to solve the CAPTCHA...\n`);

            // Wait for CAPTCHA to be solved (check every 2 seconds)
            const maxIterations = Math.ceil(this.captchaWaitTime / 2000);
            for (let i = 0; i < maxIterations; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const stillHasCaptcha = await this.page.evaluate(() => {
                    return !!(
                        document.querySelector('iframe[src*="captcha"]') ||
                        document.querySelector('iframe[src*="recaptcha"]') ||
                        document.querySelector('.g-recaptcha') ||
                        document.querySelector('#captcha')
                    );
                });
                if (!stillHasCaptcha) {
                    console.log('✅ CAPTCHA solved! Continuing...\n');
                    return true;
                }
            }
            console.log('⚠️  CAPTCHA still present after 60 seconds, continuing anyway...\n');
        }
        return !hasCaptcha;
    }

    /**
     * Add random human-like delay
     */
    async randomDelay(min = 1000, max = 3000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Scrape auctions from Copart's auction calendar for a specific month
     * @param targetMonth - Month name (e.g., 'January', 'February')
     * @returns Array of auction information
     */
    async scrapeCalendar(targetMonth) {
        if (!this.page) {
            throw new Error('Scraper not initialized. Call initialize() first.');
        }

        console.log(`Navigating to Copart auction calendar (month: ${targetMonth})...`);

        try {
            const res = await this.page.goto(copartCalendarUrl, {
                waitUntil: 'domcontentloaded',
                timeout: this.timeout,
            });
            if (res && res.status() === 407) {
                console.log('  ⚠️  Received 407 on calendar load. Attempting re-auth and retry...');
                if (this.proxy?.username && this.proxy?.password) {
                    try {
                        await this.page.authenticate({ username: this.proxy.username, password: this.proxy.password });
                    } catch { }
                }
                await this.randomDelay(500, 1000);
                const res2 = await this.page.goto(copartCalendarUrl, { waitUntil: 'domcontentloaded', timeout: this.timeout });
                if (res2 && res2.status() === 407) {
                    console.log('  ❌ Still 407 after retry. Consider verifying proxy credentials or disabling proxy to proceed.');
                }
            }
            console.log('Calendar page loaded');
        } catch (error) {
            console.log(`Navigation timeout or error: ${error.message}`);
            console.log(`Retrying with faster settings...`);
            // Retry with less strict wait condition
            try {
                const res3 = await this.page.goto(copartCalendarUrl, {
                    waitUntil: 'domcontentloaded',
                    timeout: Math.max(10000, this.timeout - 5000),
                });
                if (res3 && res3.status() === 407) {
                    console.log('  ❌ 407 on retry. Disabling proxy for fallback attempt...');
                    // Fallback: try without proxy to at least proceed
                    await this.page.close();
                    await this.browser.close();
                    const argsNoProxy = launchArgs.filter(a => !a.startsWith('--proxy-server='));
                    this.browser = await puppeteer.launch({ headless: this.headless, args: argsNoProxy });
                    this.page = await this.browser.newPage();
                    await this.page.setViewport({ width: 1920, height: 1080 });
                    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                    await this.page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9', Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 'Accept-Encoding': 'gzip, deflate, br', 'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Site': 'none', 'Cache-Control': 'max-age=0' });
                    await this.page.goto(copartCalendarUrl, { waitUntil: 'domcontentloaded', timeout: Math.max(10000, this.timeout) });
                }
                console.log('Calendar page loaded (domcontentloaded)');
            } catch (retryError) {
                throw new Error(`Failed to load calendar page: ${retryError.message}`);
            }
        }

        // Wait for dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds for JS to load auctions

        // Check for CAPTCHA
        await this.checkAndHandleCaptcha();

        // Add another delay to appear more human
        // await this.randomDelay(500, 1000);

        // Wait for auction links to appear
        await this.page
            .waitForSelector('a[href*="saleListResult"], a[href*="auctionDashboard"]', { timeout: 10000 })
            .catch(() => { });

        // Optional: Save calendar snapshot for debugging
        // try {
        //     const html = await this.page.content();
        //     const snapPath = './results/calendar_snapshot.html';
        //     fs.mkdirSync('./results', { recursive: true });
        //     fs.writeFileSync(snapPath, html);
        //     console.log(`Saved calendar snapshot to ${snapPath}`);
        // } catch (e) {
        //     console.log('Could not save calendar snapshot:', e.message);
        // }

        // Extract auction data from the calendar page
        const auctions = await this.page.evaluate((monthName) => {
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
                let numberOnSale = 0;
                const lotText = text + ' ' + cells.join(' ');

                // Try multiple patterns to find lot count
                let lotMatch = lotText.match(/(\d+)\s*(?:lots?|vehicles?|cars?)/i);
                if (!lotMatch) {
                    // Try pattern where lot count might be just a number in certain positions
                    lotMatch = lotText.match(/(?:cars?|vehicles?|lots?)\s+(\d+)/i);
                }
                if (!lotMatch) {
                    // Try to find any number that looks like a lot count (3-4 digit number or specific context)
                    const numbers = lotText.match(/\b(\d{1,4})\b/g);
                    if (numbers && numbers.length > 0) {
                        // Use the largest reasonable number as lot count (likely to be count, not a year or ID)
                        const candidates = numbers.map(Number).filter(n => n > 0 && n < 10000);
                        if (candidates.length > 0) {
                            numberOnSale = Math.max(...candidates);
                        }
                    }
                } else {
                    numberOnSale = parseInt(lotMatch[1]);
                }

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
                    } catch (e) {
                        // Skip row errors
                    }
                });
            }
            return auctionList;
        }, targetMonth);

        console.log(`Found ${auctions.length} ${targetMonth} auctions from calendar`);
        return auctions;
    }

    /**
     * Save scraped auctions to JSON file
     */
    async saveResults(auctions, filename) {
        const data = {
            scrapedAt: new Date().toISOString(),
            totalAuctions: auctions.length,
            auctions,
        };

        const dir = './results';
        fs.mkdirSync(dir, { recursive: true });
        const filePath = `${dir}/${filename}`;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`\n✅ Saved ${auctions.length} auctions to ${filePath}`);
    }

    /**
     * Close browser and cleanup
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('Browser closed');
        }
    }
}

/**
 * Convenience function to scrape calendar with automatic initialization and cleanup
 */
export async function scrapeCopartCalendar(targetMonth, options = {}) {
    const scraper = new CopartCalendarScraper(options);
    try {
        await scraper.initialize();
        const auctions = await scraper.scrapeCalendar(targetMonth);
        return auctions;
    } finally {
        await scraper.close();
    }
}
