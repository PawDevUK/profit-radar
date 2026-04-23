import { NextRequest, NextResponse } from 'next/server';
import saleListScraper from '@/lib/scrapers/copart/saleList/saleListScraper';
import { getAllSalesLists } from '@/lib/db/db';
import { format, isPast } from 'date-fns';
import { saveSalesList } from '@/lib/db/db';

export async function PUT(NextRequest) {
	const allDBdata = await getAllSalesLists();
	const auctions = allDBdata[0].auctions.slice(9);
	let firstAuction = [];
	auctions.map((auction) => {
		if (!isPast(auction.currentSale)) {
			firstAuction.push(auction);
		}
	});
	firstAuction = firstAuction[0];

	const saleUrl = firstAuction.currentSaleUrl;

	try {
		if (saleUrl) {
			console.log('Starting scraping', firstAuction);
			const scrapedData = await saleListScraper(saleUrl, 1);
			const scrapedSingleLot = scrapedData[0].scrapedLotObj;
			await saveSalesList(firstAuction._id, scrapedSingleLot);
			return NextResponse.json({
				message: 'Scraped and saved sales list success!!',
				data: scrapedSingleLot,
			});
		} else {
			console.log('Not scraped any data');
		}
	} catch (e) {
		console.log(e);
	}
}
