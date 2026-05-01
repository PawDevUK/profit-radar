import { login_CSV } from '@/lib/scrapers/copart/login_CSV/login_CSV';

import { NextResponse } from 'next/server';
const tempUrl =
	'https://www.copart.com/saleListResult/376/2026-05-01?location=OH%20-%20Akron&saleDate=1777644000000&liveAuction=false&from=%2FsalesListResult&yardNum=376&qId=e2abaa7e-31cb-4be0-bb78-93292d1d8101-1777578609594';

const landingUrl = 'https://www.copart.com';
export async function GET({ salesLsit }) {
	await login_CSV(landingUrl, tempUrl);
	return NextResponse.json({ data: 'Success!' });
}
