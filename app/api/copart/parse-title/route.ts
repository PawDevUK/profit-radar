import { NextRequest, NextResponse } from 'next/server';
import { parseCarTitleWithAI, enhanceCarDataWithAIParsing } from '@/lib/ai-title-parser';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { title, titles, cars } = body;

		// Single title parsing
		if (title) {
			const parsed = await parseCarTitleWithAI(title);
			return NextResponse.json(parsed);
		}

		// Batch title parsing
		if (titles && Array.isArray(titles)) {
			const results = await Promise.all(titles.map((t: string) => parseCarTitleWithAI(t)));
			return NextResponse.json(results);
		}

		// Enhance car data with AI parsing
		if (cars && Array.isArray(cars)) {
			const enhanced = await enhanceCarDataWithAIParsing(cars);
			return NextResponse.json(enhanced);
		}

		return NextResponse.json({ error: 'Missing required field: title, titles, or cars' }, { status: 400 });
	} catch (error: any) {
		console.error('AI title parsing error:', error);
		return NextResponse.json(
			{
				error: 'Failed to parse title',
				details: error.message,
			},
			{ status: 500 },
		);
	}
}
