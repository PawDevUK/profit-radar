import { login_CSV } from '@/lib/scrapers/copart/login_CSV/login_CSV';

import { NextRequest, NextResponse } from 'next/server';
const landingUrl = 'https://www.copart.com';

export async function POST(request: NextRequest) {
	const req = await request.json();
	const saleUrl = req.saleListURL;
	const saleId = req.saleId;
	let data;
	let message = '';
	if (saleId && saleUrl) {
		try {
			data = await login_CSV(landingUrl, saleUrl, saleId);
		} catch (e) {
			message = e instanceof Error ? e.message : String(e);
			console.error(e);
		}
	}
	message = 'The saleId or saleListUrl is missing!! The sale List is not downloaded.';
	return NextResponse.json({
		message,
		data,
	});
}
