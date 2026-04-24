import { NextRequest, NextResponse } from 'next/server';
import { getOneSalesList } from '@/lib/db/db';

export async function GET() {
	const fetchedSaleList = await getOneSalesList('69e8914d2f2be50e2cecd41e');
	if (fetchedSaleList) {
		return NextResponse.json(fetchedSaleList);
	}
	return NextResponse.json('No data fetched');
}
