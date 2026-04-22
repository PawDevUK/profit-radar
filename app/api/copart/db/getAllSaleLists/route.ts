import { getAllSalesLists } from '@/lib/db/db';

import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const data = await getAllSalesLists();
		if (data) {
			return NextResponse.json(data);
		} else {
			return NextResponse.json({
				message: 'No Calendar fetched from the Database',
			});
		}
	} catch (e) {
		console.log(e);
	}
}
