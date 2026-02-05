import 'dotenv/config';

export interface ProxyConfig {
	headless: boolean;
	enabled: boolean;
	server?: string;
	username?: string;
	password?: string;
	timeout: number;
	captchaWaitTime: number;
}

export const proxyConfig: ProxyConfig = {
	timeout: 15000,
	headless: false,
	enabled: false,
	server: process.env.proxy_server,
	username: process.env.proxy_username,
	password: process.env.proxy_password,
	captchaWaitTime: 60000,
};
