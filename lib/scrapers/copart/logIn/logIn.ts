import { createContext } from '@/lib/scrapers/proxy/createContext';
import { type GoToOptions } from 'puppeteer';
import path from 'path';
import { promises as fs } from 'fs';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

const email = process.env.COPART_LOGIN;
const password = process.env.COPART_PASS;

const waitForCsvDownload = async (dir: string, timeoutMs = 30000) => {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		const files = await fs.readdir(dir);
		const csv = files.find((f) => f.endsWith('.csv'));
		const partial = files.find((f) => f.endsWith('.crdownload'));
		if (csv && !partial) return path.join(dir, csv);
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error('CSV download timed out');
};

export const logInToCopart = async function (url: string) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	let browser: { close: () => Promise<void> } | null = null;
	const timeoutNumber = 200000;
	try {
		if (url) {
			const ctx = await createContext(options);
			browser = ctx.browser;
			const signIn = ctx.page;

			const downloadDir = path.join(process.cwd(), 'tmp', 'downloads');
			await fs.mkdir(downloadDir, { recursive: true });

			const cdp = await signIn.target().createCDPSession();
			await cdp.send('Page.setDownloadBehavior', {
				behavior: 'allow',
				downloadPath: downloadDir,
			});

			await signIn.goto(url, pageOptions);

			const consentSelector = 'button[aria-label="Consent"].fc-button.fc-cta-consent.fc-primary-button';
			await signIn.waitForSelector(consentSelector, { timeout: timeoutNumber, visible: true });
			await signIn.click(consentSelector);

			await signIn.waitForSelector('[data-uname="homePageSignIn"]', { timeout: timeoutNumber, visible: true });
			await signIn.click('[data-uname="homePageSignIn"]');
			await signIn.waitForSelector('[data-uname="homePageMemberSignIn"]', { timeout: timeoutNumber });
			await signIn.click('[data-uname="homePageMemberSignIn"]');
			await signIn.waitForSelector('#email-member-number', { timeout: timeoutNumber });
			await signIn.waitForSelector('#member-password', { timeout: timeoutNumber });
			if (email) {
				await signIn.click('#email-member-number');
				await signIn.type('#email-member-number', email);
			} else {
				console.log('No password provided!');
			}

			if (password) {
				await signIn.click('#member-password');
				await signIn.type('#member-password', password);
			} else {
				console.log('No password provided!');
			}
			await signIn.click('.cprt-btn-blue.p-full-width.sign-in-button');
			// User should be loged in now --------
			console.log('User loged in!!');
			await signIn.goto(url, pageOptions);
			await signIn.waitForSelector('.cprt-btn-white.export-csv-button', { visible: true, timeout: 15000 });
			await signIn.click('.cprt-btn-white.export-csv-button');
			const csvPath = await waitForCsvDownload(downloadDir);
			console.log('CSV downloaded:', csvPath);
			await signIn.waitForSelector('#my-account-btn', { timeout: timeoutNumber, visible: true });
			await signIn.click('#my-account-btn');
			await signIn.waitForSelector('.btn-reset.item-label.menu-item.sign-out-item', { timeout: timeoutNumber, visible: true });
			await signIn.click('.btn-reset.item-label.menu-item.sign-out-item');
			console.log('User loged out !!');
		}
	} catch (e) {
		console.error(e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};
