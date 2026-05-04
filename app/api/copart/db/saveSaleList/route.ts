import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
	return await NextResponse.json({
		data: [],
		message: '',
	});
}
