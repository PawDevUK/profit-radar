import { NextRequest, NextResponse } from 'next/server';
import { getAllLots } from '@/lib/db/db';
import { parseCarUrlWithAI } from '@/lib/openAI/ai-url-parser';
import { LotDetailsModel } from '@/lib/db/models';

export async function GET(req: NextRequest) {
	const allLots = await getAllLots();

	const plainLots = allLots.map((doc) => doc.toObject());
	const lotsNoTitle = plainLots.filter((lot) => !lot.title);

	const numberToCovert = lotsNoTitle.length;
	console.log('Number of lots to process!!', numberToCovert);
	let numberProcessed = 0;
	for (const lot of plainLots) {
		if (!lot.title) {
			const { title, make, model, year, trim } = await parseCarUrlWithAI(lot.lotUrl);
			console.log('Processed urls ---', (numberProcessed += 1));
			console.log('Remaining --- ', numberToCovert - numberProcessed);

			await LotDetailsModel.findOneAndUpdate(
				{ lotInv: lot.lotInv },
				{
					title: title,
					make: make,
					model: model,
					year: year,
					trim: trim,
				},
			);
			console.log('Saved');
		}
	}

	return NextResponse.json({
		numberToCovert,
		numberProcessed,
	});
}
