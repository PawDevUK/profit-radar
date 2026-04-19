import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

type ScrapedLot = {
	scrapedLotObj?: {
		lotNumber?: string | number;
		images?: string[];
		[key: string]: unknown;
	};
	[key: string]: unknown;
};

const INPUT_JSON = path.join(process.cwd(), 'lib/scrapers/copart/saleList/scrapedSaleList.json');
const OUTPUT_JSON = INPUT_JSON; // overwrite same file
const PUBLIC_BASE_DIR = path.join(process.cwd(), 'public', 'lot-images', 'copart');
const PUBLIC_BASE_URL = '/lot-images/copart';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function sanitizeSegment(value: string): string {
	return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function extFromUrlOrType(url: string, contentType: string | null): string {
	const byUrl = path.extname(new URL(url).pathname).toLowerCase();
	if (byUrl && byUrl.length <= 5) return byUrl;
	if (!contentType) return '.jpg';
	if (contentType.includes('png')) return '.png';
	if (contentType.includes('webp')) return '.webp';
	if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
	return '.jpg';
}

async function exists(filePath: string): Promise<boolean> {
	try {
		await stat(filePath);
		return true;
	} catch {
		return false;
	}
}

async function downloadWithRetry(url: string, outPath: string, attempts = 3): Promise<boolean> {
	for (let i = 1; i <= attempts; i++) {
		try {
			const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const buf = Buffer.from(await res.arrayBuffer());
			await writeFile(outPath, buf);
			return true;
		} catch {
			if (i < attempts) await sleep(400 * i);
		}
	}
	return false;
}

async function main() {
	const raw = await readFile(INPUT_JSON, 'utf8');
	const data = JSON.parse(raw) as ScrapedLot[];

	await mkdir(PUBLIC_BASE_DIR, { recursive: true });

	let downloaded = 0;
	let reused = 0;
	let failed = 0;

	for (const item of data) {
		const lot = item.scrapedLotObj;
		if (!lot) continue;

		const lotNumber = sanitizeSegment(String(lot.lotNumber ?? 'unknown-lot'));
		const lotDir = path.join(PUBLIC_BASE_DIR, lotNumber);
		await mkdir(lotDir, { recursive: true });

		const images = Array.isArray(lot.images) ? lot.images : [];
		const uniqueImages = [...new Set(images)];
		const localizedImages: string[] = [];

		for (let idx = 0; idx < uniqueImages.length; idx++) {
			const remoteUrl = uniqueImages[idx];
			if (!remoteUrl?.startsWith('http')) continue;

			let ext = '.jpg';
			try {
				const head = await fetch(remoteUrl, { method: 'HEAD' });
				ext = extFromUrlOrType(remoteUrl, head.headers.get('content-type'));
			} catch {
				ext = extFromUrlOrType(remoteUrl, null);
			}

			const fileName = `img-${String(idx + 1).padStart(3, '0')}${ext}`;
			const filePath = path.join(lotDir, fileName);
			const publicRef = `${PUBLIC_BASE_URL}/${lotNumber}/${fileName}`;

			if (await exists(filePath)) {
				reused++;
				localizedImages.push(publicRef);
				continue;
			}

			const ok = await downloadWithRetry(remoteUrl, filePath, 3);
			if (ok) {
				downloaded++;
				localizedImages.push(publicRef);
			} else {
				failed++;
				// keep original URL as fallback
				localizedImages.push(remoteUrl);
			}
		}

		lot.images = localizedImages;
	}

	await writeFile(OUTPUT_JSON, JSON.stringify(data, null, 2) + '\n', 'utf8');

	console.log(`Done.
Downloaded: ${downloaded}
Reused: ${reused}
Failed: ${failed}
Updated: ${OUTPUT_JSON}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
