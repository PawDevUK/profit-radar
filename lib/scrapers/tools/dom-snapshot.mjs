import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

function parseArgs() {
    const url = process.argv[2];
    if (!url) {
        console.error('Usage: node lib/scrapers/tools/dom-snapshot.mjs <url> [label]');
        process.exit(1);
    }
    const label = process.argv[3] || 'snapshot';
    return { url, label };
}

async function ensureDir(p) {
    fs.mkdirSync(p, { recursive: true });
}

async function main() {
    const { url, label } = parseArgs();
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36');

    const debugDir = path.join(process.cwd(), 'results', 'debug');
    ensureDir(debugDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const base = path.join(debugDir, `${label}-${timestamp}`);

    try {
        console.log('Navigating to', url);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Dismiss common cookie banners
        try {
            const selectors = ['#onetrust-accept-btn-handler', 'button[aria-label="Accept All"]', 'button[aria-label="Accept all"]'];
            for (const s of selectors) {
                const btn = await page.$(s);
                if (btn) { await btn.click(); break; }
            }
        } catch { }

        // Small wait for dynamic content
        await new Promise(r => setTimeout(r, 2000));

        // Progressive scroll to trigger lazy rendering inside window and overflow containers
        async function progressiveScrollAll() {
            try {
                await page.evaluate(async () => {
                    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
                    // Scroll window multiple passes
                    for (let pass = 0; pass < 2; pass++) {
                        for (let y = 0; y <= document.body.scrollHeight; y += 600) {
                            window.scrollTo(0, y);
                            await sleep(50);
                        }
                    }
                    // Scroll overflow containers
                    const nodes = Array.from(document.querySelectorAll('*'));
                    for (const el of nodes) {
                        const anyEl = el;
                        if (anyEl && anyEl.scrollHeight && anyEl.clientHeight && anyEl.scrollHeight > anyEl.clientHeight) {
                            anyEl.scrollTop = anyEl.scrollHeight;
                            await sleep(20);
                        }
                    }
                    window.scrollTo(0, 0);
                });
            } catch { }
        }

        await progressiveScrollAll();

        // Strip styling: remove <style>, external stylesheets, and inline style attributes
        try {
            await page.evaluate(() => {
                // Remove inline <style> tags
                document.querySelectorAll('style').forEach((el) => el.remove());
                // Remove external stylesheets
                document.querySelectorAll('link[rel~="stylesheet"], link[type="text/css"], link[as="style"]').forEach((el) => el.remove());
                // Remove inline style attributes
                document.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));
            });
        } catch { }

        // Wait until tables/rows or key anchors appear (up to ~20s)
        try {
            await page.waitForFunction(() => {
                return !!(
                    document.querySelector('tr') ||
                    document.querySelector('td') ||
                    document.querySelector('table') ||
                    document.querySelector('a[href*="saleListResult"]') ||
                    document.querySelector('a[data-url*="saleListResult"]') ||
                    document.querySelector('.fc')
                );
            }, { timeout: 20000 });
        } catch {
            // If still not visible, try one more scroll + tiny wait
            await progressiveScrollAll();
            await new Promise(r => setTimeout(r, 1500));
        }

        // Save HTML and screenshot
        const html = await page.content();
        fs.writeFileSync(`${base}.html`, html, 'utf-8');
        await page.screenshot({ path: `${base}.png`, fullPage: true });

        // DOM summary
        const summary = await page.evaluate(() => {
            const tagCounts = {};
            const classCounts = {};
            const all = Array.from(document.querySelectorAll('*'));
            for (const el of all) {
                const tag = el.tagName.toLowerCase();
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                const classes = (el.className || '').toString().split(/\s+/).filter(Boolean);
                for (const c of classes) classCounts[c] = (classCounts[c] || 0) + 1;
            }
            const pick = (n, obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));
            const anchors = Array.from(document.querySelectorAll('a')).map(a => ({
                text: (a.textContent || '').trim(), href: a.getAttribute('href') || '', dataUrl: a.getAttribute('data-url') || '', id: a.id || '', classes: (a.className || '').toString(),
            }));
            const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
                text: (b.textContent || '').trim(), id: b.id || '', classes: (b.className || '').toString(), ariaLabel: b.getAttribute('aria-label') || '', title: b.getAttribute('title') || '',
            }));
            return { url: location.href, title: document.title, topTags: pick(15, tagCounts), topClasses: pick(20, classCounts), anchors, buttons };
        });
        fs.writeFileSync(`${base}-dom.json`, JSON.stringify(summary, null, 2), 'utf-8');

        console.log('Saved:');
        console.log(`  HTML -> ${base}.html`);
        console.log(`  PNG  -> ${base}.png`);
        console.log(`  JSON -> ${base}-dom.json`);
    } catch (e) {
        console.error('Snapshot failed:', e?.message || e);
    } finally {
        await browser.close();
    }
}

main();
