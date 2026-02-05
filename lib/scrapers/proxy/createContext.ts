import puppeteer from 'puppeteer';
import { proxyConfig } from './proxy-config';

export async function createContext(options = {}) {
	const config = { ...proxyConfig, ...options };
	const launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled'];

	if (config?.enabled && config?.server) {
		launchArgs.push(`--proxy-server=${config.server}`);
	}

	const browser = await puppeteer.launch({ headless: config.headless, args: launchArgs });
	const page = await browser.newPage();

	if (config?.enabled && config?.username && config?.password) {
		await page.authenticate({ username: config.username, password: config.password });
	}
	await page.setViewport({ width: 1280, height: 800 });
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

	return { browser, page, config };
}
