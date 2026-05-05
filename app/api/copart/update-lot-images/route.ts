import scrapeLot from '@/lib/scrapers/copart/lot/lotScraper';
import { getAllLots } from '@/lib/db/db';
import { NextResponse } from 'next/server';
export async function GET() {
	const allLots = await getAllLots();
	let updatedLotList = [];

	for (let lot of allLots) {
		if (!lot.images[0].copart) {
			console.log(lot.lotUrl);
			const lotObject = await scrapeLot(lot.lotUrl);
			console.log(lotObject);
			if (lotObject) {
				lot.images[0].copart = lotObject[0].images.copart;
			}
			console.log(lot);
		}
	}

	// const scrapedInfo = await scrapeLot(['https://www.copart.com/lot/99423825/salvage-2012-chevrolet-impala-lt-oh-akron']);
	// const stripped = removeNullProps(scrapeLot);
	// console.log(stripped);

	// console.log(scrapedInfo);
	return NextResponse.json({
		message: 'Scraped images and data successful!',
		// data: stripped,
	});
}
