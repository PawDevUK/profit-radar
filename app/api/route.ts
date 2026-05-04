import { NextRequest, NextResponse } from 'next/server';
import { convertJsonSalesList } from '@/lib/csvToLotDetails/jsonToLotDetails';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id'); // e.g. /api?id=123
	const uuid = uuidv4();
	const converted = await convertJsonSalesList(uuid);
	return NextResponse.json({
		data: converted,
		message: '',
	});
}
