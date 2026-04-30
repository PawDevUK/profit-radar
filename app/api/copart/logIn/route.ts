import { logInToCopart } from '@/lib/scrapers/copart/logIn/logIn';

import { NextResponse } from 'next/server';
const tempUrl =
	'https://www.copart.com/saleListResult/127/2026-04-30?location=PA%20-%20York%20Haven&saleDate=1777557600000&liveAuction=false&from=%2FsalesListResult&yardNum=127&qId=1a813ad6-7f82-46c2-bf32-efdc71e1a1f1-1777495209260';
const landingUrl = 'https://www.copart.com';

export async function GET() {
	await logInToCopart(landingUrl, tempUrl);
	return NextResponse.json({ data: 'Success!' });
}
