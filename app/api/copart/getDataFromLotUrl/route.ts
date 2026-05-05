import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id'); // e.g. /api?id=123
	return NextResponse.json({
		data: [],
		message: '',
	});
}
