import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	let message: string = '';
	let body;
	let report;
	let saveReportResponse;
	const origin = new URL(request.url).origin;
	if (request.body) {
		body = await request.json();
	}

	if (!body || typeof body !== 'object' || Array.isArray(body) || !body.lotInv) {
		message = 'No lot details data has been passed. Profitability report is not generated.';
		return NextResponse.json({ message }, { status: 400 });
	}

	const reportResponse = await fetch(`${origin}/api/copart/getProfitStatus`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});
	report = await reportResponse.json();

	if (report) {
		const saveResponse = await fetch(`${origin}/api/copart/db/saveProfitStatusToLot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		saveReportResponse = saveResponse.json();
	}

	return NextResponse.json({
		message,
	});
}
