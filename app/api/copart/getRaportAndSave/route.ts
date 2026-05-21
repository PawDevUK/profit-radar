import { NextRequest, NextResponse } from 'next/server';
import { getOneLotById } from '@/lib/db/db';

export async function POST(request: NextRequest) {
	let message: string = '';
	let body;
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

	if (!reportResponse.ok) {
		const reportError = await reportResponse.text();
		return NextResponse.json({ message: `Failed to generate report: ${reportError}` }, { status: 502 });
	}

	const report = await reportResponse.json();
	const lotWithProfitStatus = report?.lotWithProfitStatus;

	if (lotWithProfitStatus?.profitStatus) {
		message = 'Saving report to database!';
		const saveResponse = await fetch(`${origin}/api/copart/db/saveProfitStatusToLot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(lotWithProfitStatus),
		});

		if (!saveResponse.ok) {
			const saveError = await saveResponse.text();
			return NextResponse.json({ message: `Failed to save report: ${saveError}` }, { status: 502 });
		}

		saveReportResponse = await saveResponse.json();
	} else {
		message = 'Report generated but profitStatus is missing.';
	}

	return NextResponse.json({
		message,
		report,
		saveReportResponse,
	});
}
