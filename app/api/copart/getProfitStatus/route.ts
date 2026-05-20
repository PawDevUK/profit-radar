import { NextRequest, NextResponse } from 'next/server';
import callOpenAI from '@/lib/openAI/callOpenAI';
import createPrompt from './createPrompt';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

export const maxDuration = 60; // seconds

export async function POST(request: NextRequest) {
	let message: string = '';
	let lotWithProfitStatus;
	let body;

	async function getProfitStatus(lotDetails: LotDetailsType) {
		const prompt = createPrompt(JSON.stringify(lotDetails));
		const openAiResponse = await callOpenAI(prompt);
		return JSON.parse(openAiResponse);
	}

	if (request.body) {
		body = await request.json();
	}
	if (!body || typeof body !== 'object' || Array.isArray(body) || !body.lotInv) {
		message = 'No lot details data has been passed. Profitability report is not generated.';
		return NextResponse.json({ message }, { status: 400 });
	}
	if (body.title && body.images && body.saleName && !body.profitStatus) {
		try {
			lotWithProfitStatus = body;
			lotWithProfitStatus.profitStatus = await getProfitStatus(body);
		} catch (error) {
			message = error instanceof Error ? error.message : String(error);
		}
	}

	return await NextResponse.json({
		lotWithProfitStatus,
		message,
	});
}
