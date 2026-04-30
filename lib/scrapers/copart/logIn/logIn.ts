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

export const logInToCopart = async function (landingUrl: string, url: string) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};
	let browser: { close: () => Promise<void> } | null = null;
	const timeoutNumber = 200000;
	try {
		if (landingUrl && url) {
			const ctx = await createContext(options);
			browser = ctx.browser;
			const signin = ctx.page;

			const downloadDir = path.join(process.cwd(), 'tmp', 'downloads');
			await fs.mkdir(downloadDir, { recursive: true });

			const cdp = await signin.target().createCDPSession();
			await cdp.send('Page.setDownloadBehavior', {
				behavior: 'allow',
				downloadPath: downloadDir,
			});

			await signin.goto(landingUrl, pageOptions);

			const consentSelector = 'button[aria-label="Consent"].fc-button.fc-cta-consent.fc-primary-button';
			const consentButton = await signin.waitForSelector(consentSelector, { timeout: timeoutNumber, visible: true });
			if (consentButton) {
				await signin.click(consentSelector);
			}

			await signin.waitForSelector('[data-uname="homePageSignIn"]', { timeout: timeoutNumber, visible: true });
			const signinButton = await signin.$('[data-uname="homePageSignIn"]');
			if (signinButton) {
				await signin.click('[data-uname="homePageSignIn"]');
			}
			const memberSignin = await signin.waitForSelector('[data-uname="homePageMemberSignIn"]', { timeout: timeoutNumber, visible: true });
			if (memberSignin) {
				await memberSignin.scrollIntoView();
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

			// Submit
			await signin.waitForSelector(submitSelector, { visible: true, timeout: timeoutNumber });

			await Promise.all([
				// Copart login is often XHR, so this is safer than waitForNavigation alone
				signin.waitForResponse((res) => res.url().toLowerCase().includes('login') && [200, 204, 302].includes(res.status()), { timeout: timeoutNumber }).catch(() => null),
				signin.click(submitSelector),
			]);

			// Confirm logged-in UI (pick a stable selector that appears only when signed in)
			await signin.waitForSelector('#my-account-btn', {
				visible: true,
				timeout: timeoutNumber,
			});

			// Optional: double-check cookies exist
			const cookies = await signin.cookies();
			const hasSession = cookies.some((c) => /session|token|auth|copart/i.test(c.name));
			if (!hasSession) {
				throw new Error('Login click done, but no auth cookie found yet.');
			}

			// Now navigate
			await signin.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutNumber });
			await signin.waitForSelector('.cprt-btn-white.export-csv-button', { visible: true, timeout: 15000 });
			await signin.click('.cprt-btn-white.export-csv-button');
			const csvPath = await waitForCsvDownload(downloadDir);
			console.log('CSV downloaded:', csvPath);
		}
	} catch (e) {
		console.error(e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};
