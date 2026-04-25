import { NextResponse } from 'next/server';
import saleListScraper from '@/lib/scrapers/copart/saleList/saleListScraper';
import { getAllSalesLists } from '@/lib/db/db';
import { isPast } from 'date-fns';
import { saveSalesList } from '@/lib/db/db';
import { SaleListType } from '@/lib/types/calendar-type';

export async function PUT() {
	const allDBdata = await getAllSalesLists();
	const auctions = allDBdata[0].auctions;
	const currentSales: SaleListType[] = [];
	const limitScrape = null;

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
			scrapedData = await saleListScraper(sale.currentSaleUrl, limitScrape);
			console.log('Finished scrapping action.');
			if (Array.isArray(scrapedData)) {
				arrayOfScrapedLots = scrapedData.map((lot) => {
					return lot.scrapedLotObj;
				});
				successSave = (await saveSalesList(_id, arrayOfScrapedLots)).savedToDb;
			}
		}
		if (scrapedData && successSave) {
			return successSave;
		}
		return (successSave = false);
	}

	let scraping = false;
	let scrapeSaveSuccess = false;

	try {
		for (let i = 0; i < currentSales.length; i++) {
			const saleId = currentSales[i]._id;
			scraping = true;
			if (scraping) {
				scrapeSaveSuccess = await scrapeAndSave(currentSales[i], saleId);
				if (scrapeSaveSuccess && scraping) {
					scraping = false;
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
	// });
}
