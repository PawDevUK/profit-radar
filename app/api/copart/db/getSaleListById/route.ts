import { NextRequest, NextResponse } from 'next/server';
import { getOneSalesList } from '@/lib/db/db';

export async function GET(request: NextRequest) {
	const id = request.nextUrl.searchParams.get('id');

	const fetchedSaleList = await getOneSalesList(id ? id : '');
	if (fetchedSaleList) {
		return NextResponse.json(fetchedSaleList);
	}
	return NextResponse.json('No data fetched');
}
