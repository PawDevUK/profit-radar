import { login_CSV } from '@/lib/scrapers/copart/login_CSV/login_CSV';

import { NextResponse } from 'next/server';
const tempUrl =
	'https://www.copart.com/saleListResult/376/2026-05-05?location=OH%20-%20Akron&saleDate=1777989600000&liveAuction=false&from=%2FsalesListResult&yardNum=376&qId=1a813ad6-7f82-46c2-bf32-efdc71e1a1f1-1777930318723';

const landingUrl = 'https://www.copart.com';
export async function GET() {
	const data = await login_CSV(landingUrl, tempUrl);
	return NextResponse.json({ data: data, message: 'Success!' });
}
