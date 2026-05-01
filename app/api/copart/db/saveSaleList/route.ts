import { NextRequest, NextResponse } from 'next/server';

export async function GET({ NextRequest }) {
	return await NextResponse.json({
		data: [],
		message: '',
	});
}
