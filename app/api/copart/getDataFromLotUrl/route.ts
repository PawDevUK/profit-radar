import { NextRequest, NextResponse } from 'next/server';
import { getAllLots } from '@/lib/db/db';
import { parseCarUrlWithAI } from '@/lib/openAI/ai-url-parser';
import { LotDetailsModel } from '@/lib/db/models';

export async function GET(req: NextRequest) {
	const allLots = await getAllLots();

	const plainLots = allLots.map((doc) => doc.toObject());
	const lotsNoTitle = plainLots.filter((lot) => !lot.title);
	const lotsNoUrl = lotsNoTitle.filter((lot) => !lot.lotUrl);

	const numberToCovert = lotsNoTitle.length;
	console.log('Number of lots to process!!', numberToCovert);
	console.log('Lots with no URL (will be skipped):', lotsNoUrl.length);
	let numberProcessed = 0;
	for (const lot of plainLots) {
		if (!lot.title) {
			if (!lot.lotUrl) {
				console.log('Skipping lot with no URL:', lot.lotInv);
				continue;
			}
			const { title, make, model, year, trim } = await parseCarUrlWithAI(lot.lotUrl);
			console.log('Processed urls ---', (numberProcessed += 1));
			console.log('Remaining --- ', numberToCovert - numberProcessed);

			if (!title) {
				console.log('AI returned no title for:', lot.lotUrl);
				continue;
			}

			await LotDetailsModel.findOneAndUpdate({ _id: lot._id }, { title, make, model, year, trim });
			console.log('Saved', lot._id);
		}
	}

	return NextResponse.json({
		numberToCovert,
		numberProcessed,
	});
}
