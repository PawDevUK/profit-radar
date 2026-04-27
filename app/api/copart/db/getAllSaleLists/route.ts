import { getAllSalesLists } from '@/lib/db/db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
	try {
		const data = await getAllSalesLists();
		return NextResponse.json(
			{
				message: data.length ? 'OK' : 'No Calendar fetched from the Database',
				data,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('getAllSaleLists GET failed:', error);
		return NextResponse.json({ error: 'Failed to fetch sale lists' }, { status: 500 });
	}
}
