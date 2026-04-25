import mongoose from 'mongoose';
import 'dotenv/config';
import MonthSaleModel from './models';
import { CalendarMonthType } from '@/lib/types/calendar-type';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
	if (cachedConnection && mongoose.connection.readyState === 1) return cachedConnection;
	const uri = MONGODB_URI;
	if (!uri) {
		throw new Error('MONGODB_URI environment variable is not defined');
	}
	cachedConnection = await mongoose.connect(uri, {
		dbName: process.env.MONGODB_DB || 'profit_radar',
	});
	return cachedConnection;
}

export async function saveMonthSale(scrapedCalendarMonth: CalendarMonthType) {
	if (scrapedCalendarMonth) {
		await connectDB();
		const monthSaleList = new MonthSaleModel(scrapedCalendarMonth);
		await monthSaleList.save();
		console.log('Month sale data saved to database successfully!');
	} else {
		console.log('Not enough auctions scraped, skipping save.');
	}
}

export async function getAllSalesLists() {
	await connectDB();
	const allSalesLists = MonthSaleModel.find({});

	return allSalesLists;
}

export async function saveSalesList(_id: string, SalesList: LotDetailsType[]) {
	await connectDB();

	const parentId = new mongoose.Types.ObjectId('69e8914d2f2be50e2cecd373'); // main document _id
	const auctionId = new mongoose.Types.ObjectId(_id); // nested auction _id

	try {
		if (auctionId && SalesList) {
			await MonthSaleModel.updateOne({ _id: parentId, 'auctions._id': auctionId }, { $set: { 'auctions.$.lotList': SalesList } });

			console.log('Data saved to sale list and db updated');
		} else {
			console.log('There is no sales Id or updated sales list to be saved!!');
		}
	} catch (e) {
		console.log(e);
	}

	try {
		if (auctionId && SalesList) {
			console.log('Data saved to sale list and db updated');
		} else {
			console.log('There is no sales Id or updated sales list to be saved!!');
		}
	} catch (e) {
		console.log(e);
	}
}

export async function getOneSalesList(id: string) {
	const nestedId = new mongoose.Types.ObjectId(id);
	await connectDB();
	const parentDoc = await MonthSaleModel.findOne({ 'auctions._id': nestedId });
	let nestedAuction = null;
	if (parentDoc && Array.isArray(parentDoc.auctions)) {
		nestedAuction = parentDoc.auctions.find((auction: any) => auction._id.equals(nestedId));
	}
	if (nestedAuction) {
		return nestedAuction;
	}
	console.log('No auction found!!');
}
