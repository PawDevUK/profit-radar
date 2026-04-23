import { NextResponse } from 'next/server';
import { saveOneSale } from '@/lib/db/db';

export async function PUT() {
	await saveOneSale();
	return NextResponse.json({});
}
