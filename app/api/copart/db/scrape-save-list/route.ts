import { NextResponse } from 'next/server';
import saleListScraper from '@/lib/scrapers/copart/saleList/saleListScraper';
import { getAllSalesLists } from '@/lib/db/db';
import { isPast } from 'date-fns';
import { saveSalesList } from '@/lib/db/db';
import { SaleListType } from '@/lib/types/calendar-type';
import { scrapedLotDataType } from '@/lib/types/lotDetails-type';

export async function PUT() {
	const allDBdata = await getAllSalesLists();
	const auctions = allDBdata[0].auctions;
	const currentSales: SaleListType[] = [];
	const scraping = false;
	const limitScrape = 1;

	auctions.map((auction: SaleListType) => {
		if (auction.currentSale ? !isPast(auction.currentSale) : null) {
			currentSales.push(auction);
		}
	});

	async function scrapeAndSave(sale: SaleListType, _id: string) {
		let arrayOfScrapedLots;
		let scrapedData;
		console.log('Starting scraping auctions.');
		if (sale.currentSaleUrl && _id) {
			scrapedData = await saleListScraper(sale.currentSaleUrl, limitScrape);
			console.log('Finished scrapping action.');
			if (Array.isArray(scrapedData)) {
				arrayOfScrapedLots = scrapedData.map((lot) => {
					return lot.scrapedLotObj;
				});
				await saveSalesList(_id, arrayOfScrapedLots);
			}
		}
		if (scrapedData) {
			return NextResponse.json({
				message: 'Scraped and saved sales list success!!',
				data: arrayOfScrapedLots,
			});
		}
	}
	const sale = currentSales[1];
	const saleId = sale._id;
	const saleUrl = sale.currentSaleUrl;

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
