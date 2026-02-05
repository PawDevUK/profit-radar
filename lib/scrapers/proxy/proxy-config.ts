/**
 * Proxy Configuration for Copart Scraper
 *
 * IMPORTANT: Add this file to .gitignore to protect your proxy credentials!
 *
 * Recommended Proxy Services:
 * 1. Bright Data (formerly Luminati) - $50-100/mo - https://brightdata.com
 * 2. Oxylabs - $50-150/mo - https://oxylabs.io
 * 3. SmartProxy - $40-100/mo - https://smartproxy.com
 * 4. WebShare - $5-15/mo - https://www.webshare.io (Budget option)
 * 5. ProxyMesh - $10-50/mo - https://proxymesh.com
 *
 * For best results, use RESIDENTIAL proxies with rotation
 */

import 'dotenv/config';

export interface ProxyConfig {
	headless: boolean;
	enabled: boolean;
	server?: string; // Format: 'http://hostname:port' or 'socks5://hostname:port'
	username?: string;
	password?: string;
	timeout: number;
	captchaWaitTime: number;
}

// Default configuration - With Proxy (prevents blocking)
export const proxyConfig: ProxyConfig = {
	// Sensible defaults for scraping
	timeout: 15000,
	headless: false,
	enabled: false,
	server: process.env.proxy_server,
	username: process.env.proxy_username,
	password: process.env.proxy_password,
	captchaWaitTime: 60000,
};

// Example configurations (uncomment and fill in your credentials):

/*
// Example: WebShare (Budget option - $5-15/mo)
export const proxyConfig: ProxyConfig = {
	enabled: true,
	server: 'http://p.webshare.io:80',
	username: 'YOUR_USERNAME',
	password: 'YOUR_PASSWORD',
};
*/

/*
// Example: Bright Data Residential Proxy
export const proxyConfig: ProxyConfig = {
	enabled: true,
	server: 'http://brd.superproxy.io:22225',
	username: 'brd-customer-XXX-zone-residential',
	password: 'YOUR_PASSWORD',
};
*/

/*
// Example: Oxylabs Residential Proxy
export const proxyConfig: ProxyConfig = {
	enabled: true,
	server: 'http://pr.oxylabs.io:7777',
	username: 'customer-YOUR_USERNAME-cc-us',
	password: 'YOUR_PASSWORD',
};
*/

/*
// Example: SmartProxy
export const proxyConfig: ProxyConfig = {
	enabled: true,
	server: 'http://gate.smartproxy.com:7000',
	username: 'YOUR_USERNAME',
	password: 'YOUR_PASSWORD',
};
*/

/*
// Example: ProxyMesh (rotating proxy)
export const proxyConfig: ProxyConfig = {
	enabled: true,
	server: 'http://us-wa.proxymesh.com:31280',
	username: 'YOUR_USERNAME',
	password: 'YOUR_PASSWORD',
};
*/

/*
// Example: Local proxy server (no auth)
export const proxyConfig: ProxyConfig = {
	enabled: true,
	server: 'http://localhost:8080',
};
*/
