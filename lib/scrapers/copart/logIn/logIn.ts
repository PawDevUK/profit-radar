import { createContext } from '@/lib/scrapers/proxy/createContext';
import { type GoToOptions, type HTTPResponse, type Cookie } from 'puppeteer';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

const pageOptions: GoToOptions = {
	waitUntil: 'networkidle0',
	timeout: 0,
};

const email = process.env.COPART_LOGIN;
const password = process.env.COPART_PASS;

export const logInToCopart = async function (landingUrl: string, targetUrl: string) {
	const options = {
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	};

	let browser: { close: () => Promise<void> } | null = null;
	const timeoutNumber = 200000;
	const downloadPath = path.join(process.cwd(), 'downloads');

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

		console.log('User logged in!!');
	} catch (e) {
		console.error(e);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};
