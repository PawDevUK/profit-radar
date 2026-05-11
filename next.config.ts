import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['cs.copart.com'],
		unoptimized: true,
	},
};

export default nextConfig;
