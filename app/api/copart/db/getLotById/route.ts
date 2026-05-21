import { NextRequest, NextResponse } from 'next/server';
import { getOneLotById } from '@/lib/db/db';

export async function GET(request: NextRequest) {
	const id = request.nextUrl.searchParams.get('id');

	if (!id) {
		return NextResponse.json({ message: 'Missing query param: id' }, { status: 400 });
	}

	try {
		const lot = await getOneLotById(id);

		if (!lot) {
			return NextResponse.json({ message: 'Lot not found' }, { status: 404 });
		}

		return NextResponse.json(lot, { status: 200 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to fetch lot';
		return NextResponse.json({ message }, { status: 500 });
	}
}
