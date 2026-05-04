import mongoose from 'mongoose';
import 'dotenv/config';
import { CalendarSaleModel } from './models';
import { CalendarType, SaleListType } from '@/lib/types/calendar-type';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { LotDetailsModel } from './models';

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

export async function saveCalendar(scrapedCalendarMonth: CalendarType) {
	if (scrapedCalendarMonth) {
		await connectDB();
		const CalendarSaleList = new CalendarSaleModel(scrapedCalendarMonth);
		await CalendarSaleList.save();
		console.log('Calendar sale data saved to database successfully!');
	} else {
		console.log('Not enough auctions scraped, skipping save.');
	}
}

export async function getAllSalesLists() {
	await connectDB();
	const allSalesLists = CalendarSaleModel.find({});

	return allSalesLists;
}

export async function saveLots(lots: LotDetailsType[]) {
	if (!lots || lots.length === 0) {
		console.log('No lots to save');
		return { savedCount: 0 };
	}

	try {
		await connectDB();
		const result = await LotDetailsModel.insertMany(lots);
		console.log(`${result.length} lots saved to database successfully!`);
		return {
			savedCount: result.length,
			savedToDb: true,
		};
	} catch (e) {
		console.error('Error saving lots:', e);
		throw e;
	}
}

export async function saveSalesList(_id: string, SalesList: LotDetailsType[]) {
	await connectDB();
	const auctionId = new mongoose.Types.ObjectId(_id); // nested auction _id
	const parentDoc = await CalendarSaleModel.findOne({ 'auctions._id': auctionId });
	const parentId = parentDoc?._id;
	try {
		if (auctionId && SalesList) {
			await CalendarSaleModel.updateOne(
				{ _id: parentId, 'auctions._id': auctionId },
				{ $set: { 'auctions.$.lotList': SalesList, 'auctions.$.numOfLots': SalesList.length } },
			);
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

	return {
		savedToDb: true,
	};
}

export async function getOneSalesList(id: string) {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new Error('Invalid ObjectId');
	}
	const nestedId = new mongoose.Types.ObjectId(id);
	await connectDB();
	const parentDoc = await CalendarSaleModel.findOne({ 'auctions._id': nestedId });
	let nestedAuction = null;
	if (parentDoc && Array.isArray(parentDoc.auctions)) {
		nestedAuction = parentDoc.auctions.find((auction: SaleListType) => {
			if (auction._id) {
				return auction._id.toString() === nestedId.toString();
			}
		});
	}
	if (nestedAuction) {
		return nestedAuction;
	}
	console.log('No auction found!!');
}
