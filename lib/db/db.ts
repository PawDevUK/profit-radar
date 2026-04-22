import mongoose from 'mongoose';
import 'dotenv/config';
import MonthSaleModel from './models';
import { CalendarMonthType } from '@/lib/types/calendar-type';

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
