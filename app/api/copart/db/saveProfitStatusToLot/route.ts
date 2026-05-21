import { NextRequest, NextResponse } from 'next/server';
import { updateLotProfitStatus } from '@/lib/db/db';

export async function POST(request: NextRequest) {
	let body;
	let message;
	if (request.body) {
		body = await request.json();
	}
	if (!body || typeof body !== 'object' || Array.isArray(body) || (!body.lotInv && !body._id)) {
		message = 'No lot details data has been passed. Profitability report is not generated.';
		return NextResponse.json({ message }, { status: 400 });
	}

	const saveResult = await updateLotProfitStatus(body);

	return NextResponse.json(saveResult);
}
