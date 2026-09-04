import { getAllSalesLists, getDuplicateSales } from '@/lib/db/db';

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
	try {
		const data = await getAllSalesLists();
		const duplicates = await getDuplicateSales();
		return NextResponse.json(
			{
				message: data.length ? 'OK' : 'No Calendar fetched from the Database',
				duplicates: duplicates.length > 0 ? true : false,
				duplicatesList: duplicates,
				data,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('getAllSaleLists GET failed:', error);
		return NextResponse.json({ error: 'Failed to fetch sale lists' }, { status: 500 });
	}
}
