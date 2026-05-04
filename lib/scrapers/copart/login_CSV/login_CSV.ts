import { createContext } from '@/lib/scrapers/proxy/createContext';
import { HTTPRequest, type GoToOptions, type Page, type HTTPResponse, type Cookie, type ElementHandle } from 'puppeteer';
import path from 'path';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

const email = process.env.COPART_LOGIN;
const password = process.env.COPART_PASS;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function humanClickHandle(page: Page, el: ElementHandle) {
	await el.evaluate((node: Element) => {
		(node as HTMLElement).scrollIntoView({ block: 'center', inline: 'center' });
	});

	const box = await el.boundingBox();
	if (!box) {
		throw new Error('No bounding box for export control.');
	}

	const x = box.x + box.width / 2;
	const y = box.y + box.height / 2;

	await page.bringToFront();
	await page.mouse.move(x, y, { steps: 12 });
	await sleep(80);
	await page.mouse.down();
	await sleep(60);
	await page.mouse.up();
}

async function listExportCandidates(page: Page) {
	return await page.$$eval('button, a', (nodes: Element[]) =>
		nodes
			.map((node) => {
				const el = node as HTMLElement;
				const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
				const style = window.getComputedStyle(el);
				const rect = el.getBoundingClientRect();
				return {
					tag: el.tagName,
					text,
					className: el.className || '',
					visible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
				};
			})
			.filter((x) => x.visible && (/export/i.test(x.text) || /csv/i.test(x.text))),
	);
}

async function findVisibleExportControl(page: Page) {
	const elements = await page.$$('button, a');

	for (const el of elements) {
		const info = await el.evaluate((node: Element) => {
			const html = node as HTMLElement;
			const text = (html.innerText || html.textContent || '').trim().replace(/\s+/g, ' ');
			const style = window.getComputedStyle(html);
			const rect = html.getBoundingClientRect();
			return {
				text,
				visible: rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
			};
		});

		if (!info.visible) continue;

		const text = info.text.toLowerCase();

		if (text === 'export csv' || text === 'export' || text === 'download csv' || text.includes('export csv') || text.includes('csv export')) {
			return el;
		}
	}

	return null;
}

async function waitForFileStable(
	dir: string,
	name: string,
	{ timeoutMs = 30000, stableChecks = 3, intervalMs = 250 }: { timeoutMs?: number; stableChecks?: number; intervalMs?: number } = {},
) {
	const full = path.join(dir, name);
	const start = Date.now();
	let lastSize = -1;
	let stable = 0;

	while (Date.now() - start < timeoutMs) {
		if (existsSync(full)) {
			const stat = statSync(full);
			if (stat.isFile() && stat.size > 0) {
				if (stat.size === lastSize) stable++;
				else stable = 0;
				lastSize = stat.size;
				if (stable >= stableChecks) return full;
			}
		}
		await sleep(intervalMs);
	}

	throw new Error(`File did not stabilize: ${full}`);
}

async function waitForAnyNewFileStable(dir: string, startedAt: number, { timeoutMs = 90000 }: { timeoutMs?: number } = {}) {
	const start = Date.now();

	while (Date.now() - start < timeoutMs) {
		const files = readdirSync(dir)
			.filter((f) => !f.endsWith('.crdownload') && !f.endsWith('.tmp') && !f.endsWith('.part'))
			.map((f) => ({ name: f, full: path.join(dir, f) }))
			.filter((x) => existsSync(x.full))
			.map((x) => ({ ...x, stat: statSync(x.full) }))
			.filter((x) => x.stat.isFile() && x.stat.mtimeMs >= startedAt && x.stat.size > 0)
			.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

		if (files[0]) {
			return waitForFileStable(dir, files[0].name, { timeoutMs: 15000 });
		}

		await sleep(250);
	}

	throw new Error('Download timed out');
}

export const login_CSV = async function (landingUrl: string, targetUrl: string) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	let browser: { close: () => Promise<void> } | null = null;
	const timeoutNumber = 200000;
	const downloadPath = path.join(process.cwd(), 'downloads');
	let filePath;

	if (!existsSync(downloadPath)) {
		mkdirSync(downloadPath, { recursive: true });
	}

	if (!landingUrl || !targetUrl) return;

	try {
		const ctx = await createContext(options);
		browser = ctx.browser;
		const signin = ctx.page;

		const client = await signin.target().createCDPSession();
		await client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath,
		});

		await signin.goto(landingUrl, pageOptions);

		const consentSelector = 'button[aria-label="Consent"].fc-button.fc-cta-consent.fc-primary-button';
		const consentButton = await signin.$(consentSelector);
		if (consentButton) {
			await signin.click(consentSelector);
		}

		await signin.waitForSelector('[data-uname="homePageSignIn"]', { timeout: timeoutNumber, visible: true });
		await signin.click('[data-uname="homePageSignIn"]');

		const memberSignin = await signin.waitForSelector('[data-uname="homePageMemberSignIn"]', { timeout: timeoutNumber, visible: true });
		if (memberSignin) {
			await memberSignin.evaluate((el: Element) => (el as HTMLElement).scrollIntoView());
			await memberSignin.click();
		}

		await signin.waitForSelector('#email-member-number, #username', {
			visible: true,
			timeout: timeoutNumber,
		});

		const isMemberLogin = (await signin.$('#email-member-number')) !== null;
		const userSelector = isMemberLogin ? '#email-member-number' : '#username';
		const passSelector = isMemberLogin ? '#member-password' : '#password';
		const submitSelector = isMemberLogin ? '.cprt-btn-blue.p-full-width.sign-in-button' : '[data-uname="loginSigninmemberbutton"]';

		await signin.click(userSelector, { clickCount: 3 });
		await signin.type(userSelector, email ?? '');

		await signin.waitForSelector(passSelector, { visible: true, timeout: timeoutNumber });
		await signin.click(passSelector, { clickCount: 3 });
		await signin.type(passSelector, password ?? '');

		await signin.waitForSelector(submitSelector, { visible: true, timeout: timeoutNumber });
		await Promise.all([
			signin
				.waitForResponse((res: HTTPResponse) => res.url().toLowerCase().includes('login') && [200, 204, 302].includes(res.status()), { timeout: timeoutNumber })
				.catch(() => null),
			signin.click(submitSelector),
		]);

		await signin.waitForSelector('#my-account-btn', { visible: true, timeout: timeoutNumber });

		const cookies = await signin.cookies();
		const hasSession = cookies.some((c: Cookie) => /session|token|auth|copart/i.test(c.name));
		if (!hasSession) {
			throw new Error('Login done, but no auth cookie found.');
		}

		console.log('Navigating to target url...');
		await signin.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: timeoutNumber });

		const blockedByLogin = await signin.$('[class*="sign-in-block"] #username');
		if (blockedByLogin) {
			throw new Error('Target page requires login again. Export cannot start.');
		}

		const exportBtnSelector = 'button.cprt-btn-white.export-csv-button';
		await signin.waitForSelector(exportBtnSelector, { visible: true, timeout: timeoutNumber });

		const exportHandle = await findVisibleExportControl(signin);

		if (!exportHandle) {
			const controls = await listExportCandidates(signin);
			console.log('Export candidates:', controls);
			throw new Error('Export CSV control not found.');
		}

		const exportButtonText = await exportHandle.evaluate((el: Element) => (el.textContent ?? '').trim().replace(/\s+/g, ' '));
		console.log('Export button text:', exportButtonText);

		const startedAt = Date.now();

		await Promise.allSettled([signin.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }), humanClickHandle(signin, exportHandle)]);

		filePath = await waitForAnyNewFileStable(downloadPath, startedAt, {
			timeoutMs: 90000,
		});

		console.log('Downloaded file:', filePath);
	} catch (e) {
		console.error(e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}

	await fetch(`http://localhost:3000/api?csvSalePath=${filePath}&id=23432423`, {
		method: 'GET',
		headers: { 'Content-Type': 'text/csv' },
	});
};
