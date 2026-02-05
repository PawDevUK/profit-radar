import fs from 'fs';
import path from 'path';

export const saveResults = async function (auctions: unknown[], filename: string) {
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
};

export const closeBrowser = async function (browser: { close: () => Promise<void> }) {
	if (browser) {
		await browser.close();
		console.log('Browser closed');
	}
};

// Minimal, dependency-free debug utility to help diagnose empty results
export const debugDump = async function (page: { content: () => Promise<string>; screenshot?: (opts: { path: string; fullPage: boolean }) => Promise<void> }, label = 'calendar') {
	try {
		const debugDir = path.join(process.cwd(), 'results', 'debug');
		fs.mkdirSync(debugDir, { recursive: true });
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const base = path.join(debugDir, `${label}-${timestamp}`);

		const html = await page.content();
		fs.writeFileSync(`${base}.html`, html, 'utf-8');

		if (page.screenshot) {
			await page.screenshot({ path: `${base}.png`, fullPage: true });
		}

		console.log(`🧩 Debug artifacts saved: ${base}.html / .png`);
	} catch (e: any) {
		console.warn('Failed to write debug dump:', e?.message || e);
	}
};

// Summarize DOM: tag counts, common classes, and key element details (anchors/buttons)
export const debugDOMSummary = async function (page: { evaluate: (fn: () => unknown) => Promise<unknown> }, label = 'calendar') {
	try {
		const debugDir = path.join(process.cwd(), 'results', 'debug');
		fs.mkdirSync(debugDir, { recursive: true });
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const base = path.join(debugDir, `${label}-${timestamp}`);

		const summary = await page.evaluate(() => {
			const tagCounts: Record<string, number> = {};
			const classCounts: Record<string, number> = {};

			const all = Array.from(document.querySelectorAll('*')) as HTMLElement[];
			for (const el of all) {
				const tag = el.tagName.toLowerCase();
				tagCounts[tag] = (tagCounts[tag] || 0) + 1;
				const classes = (el.className || '').toString().split(/\s+/).filter(Boolean);
				for (const c of classes) classCounts[c] = (classCounts[c] || 0) + 1;
			}

			const pick = (n: number, obj: Record<string, number>) => {
				return Object.entries(obj)
					.sort((a, b) => b[1] - a[1])
					.slice(0, n)
					.map(([name, count]) => ({ name, count }));
			};

			const anchors = Array.from(document.querySelectorAll('a')).map((a) => ({
				text: (a.textContent || '').trim(),
				href: a.getAttribute('href') || '',
				dataUrl: a.getAttribute('data-url') || '',
				id: a.id || '',
				classes: (a.className || '').toString(),
			}));

			const buttons = Array.from(document.querySelectorAll('button')).map((b) => ({
				text: (b.textContent || '').trim(),
				id: b.id || '',
				classes: (b.className || '').toString(),
				ariaLabel: b.getAttribute('aria-label') || '',
				title: b.getAttribute('title') || '',
			}));

			return {
				url: location.href,
				title: document.title,
				tagCounts,
				topTags: pick(15, tagCounts),
				topClasses: pick(20, classCounts),
				anchors,
				buttons,
			};
		});

		fs.writeFileSync(`${base}-dom.json`, JSON.stringify(summary, null, 2), 'utf-8');
		console.log(`🧩 DOM summary saved: ${base}-dom.json`);
	} catch (e: any) {
		console.warn('Failed to write DOM summary:', e?.message || e);
	}
};
