import saleListScraper from '@/lib/scrapers/copart/saleList/saleListScraper';
import { getAllSalesLists } from '@/lib/db/db';
import { isPast } from 'date-fns';
import { saveSalesList } from '@/lib/db/db';
import { SaleListType } from '@/lib/types/calendar-type';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
	let scraping = false;
	let scrapeSaveSuccess = false;
	const carLimit = Number(req.nextUrl.searchParams.get('carLimit'));
	const auctionsLimit = Number(req.nextUrl.searchParams.get('auctionsLimit'));
	const allDBdata = await getAllSalesLists();
	const auctions = allDBdata[0].auctions;
	let currentSales: SaleListType[] = [];
	const carLimitScrape = carLimit ? carLimit : null;
	const auctionsLimitScrape = auctionsLimit ? auctionsLimit : null;

	auctions.map((auction: SaleListType) => {
		if (auction.currentSale ? !isPast(auction.currentSale) : null) {
			currentSales.push(auction);
		}
	});

	async function scrapeAndSave(sale: SaleListType, _id: string) {
		let arrayOfScrapedLots;
		let scrapedData;
		let successSave = false;
		console.log('Starting scraping auctions.');
		if (sale.currentSaleUrl && _id) {
			console.log(sale.currentSaleUrl);
			scrapedData = await saleListScraper(sale.currentSaleUrl, carLimitScrape);
			console.log('Finished scrapping action.');
			if (Array.isArray(scrapedData)) {
				arrayOfScrapedLots = scrapedData.map((lot) => {
					// return lot.scrapedLotObj;
					return lot;
				});
				successSave = (await saveSalesList(_id, arrayOfScrapedLots)).savedToDb;
			}
		}
		if (scrapedData && successSave) {
			return successSave;
		}
		return (successSave = false);
	}

	// limits amount of scraped actions from calendar.
	if (auctionsLimitScrape) {
		currentSales = currentSales.slice(0, auctionsLimitScrape);
	}
	//

	try {
		for (let i = 0; i < currentSales.length; i++) {
			const saleId = currentSales[i]._id;
			scraping = true;
			if (scraping && saleId) {
				scrapeSaveSuccess = await scrapeAndSave(currentSales[i], saleId);
				if (scrapeSaveSuccess && scraping) {
					scraping = false;
				}
			}
		}
		return NextResponse.json({ message: 'Scraping and save done!!' });
	} catch (e) {
		console.log(e);
	}
}
