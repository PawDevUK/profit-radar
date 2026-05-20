import { NextRequest, NextResponse } from 'next/server';
import { updateLotProfitStatus } from '@/lib/db/db';

export async function POST(request: NextRequest) {
	let body;
	let message;
	if (request.body) {
		body = await request.json();
		await updateLotProfitStatus(body);
	}
	if (!body || typeof body !== 'object' || Array.isArray(body) || !body.lotInv) {
		message = 'No lot details data has been passed. Profitability report is not generated.';
		return NextResponse.json({ message }, { status: 400 });
	}

	return NextResponse.json({});
}
