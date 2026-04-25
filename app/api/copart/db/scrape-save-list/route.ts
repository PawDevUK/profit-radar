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
	const limitScrape = 1;

	auctions.map((auction: SaleListType) => {
		if (auction.currentSale ? !isPast(auction.currentSale) : null) {
			currentSales.push(auction);
		}
	});

	async function scrapeAndSave(sale: SaleListType, _id: string) {
		let arrayOfScrapedLots;
		let scrapedData;
		let succesSave = false;
		console.log('Starting scraping auctions.');
		if (sale.currentSaleUrl && _id) {
			scrapedData = await saleListScraper(sale.currentSaleUrl, limitScrape);
			console.log('Finished scrapping action.');
			if (Array.isArray(scrapedData)) {
				arrayOfScrapedLots = scrapedData.map((lot) => {
					return lot.scrapedLotObj;
				});
				succesSave = (await saveSalesList(_id, arrayOfScrapedLots)).savedToDb;
			}
		}
		if (scrapedData && succesSave) {
			return succesSave;
		}
		return (succesSave = false);
	}
	const sale = currentSales[1];
	const saleId = sale._id;
	const saleUrl = sale.currentSaleUrl;
	let scraping = false;
	let scrapeSaveSucces = false;

	for (let i = 0; i < currentSales.length; i++) {
		scraping = true;
		if (scraping) {
			scrapeSaveSucces = await scrapeAndSave(currentSales[i], saleId);
		}
	}

	try {
		if (saleUrl) {
			await scrapeAndSave(sale, saleId);
		} else {
			console.log('Not scraped any data');
		}
	} catch (e) {
		console.log(e);
	}
	// });
}
