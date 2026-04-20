import mongoose, { Schema, Model } from 'mongoose';
import 'dotenv/config';

const MONGODB_PROFIT_RADAR_URI = process.env.MONGODB_PROFIT_RADAR_URI;
import { CalendarAuction, CalendarMonthDoc } from '../types/calendar-type';

let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
	if (cachedConnection && mongoose.connection.readyState === 1) return cachedConnection;
	const uri = MONGODB_PROFIT_RADAR_URI;
	if (!uri) {
		throw new Error('MONGODB_PROFIT_RADAR_URI environment variable is not defined');
	}
	cachedConnection = await mongoose.connect(uri, {
		dbName: process.env.MONGODB_DB || 'profit_radar',
	});
	return cachedConnection;
}

// Lot details schema mirrors lib/types/lot-details.ts
const LotDetailsSchema = new Schema(
	{
		title: { type: String, required: true },
		year: { type: Number, required: true },
		make: { type: String, required: true },
		model: { type: String, required: true },
		trim: { type: String, required: true },
		bodyStyle: { type: String, required: true },
		runAndDrive: { type: Boolean, default: false },
		vin: { type: String, required: true },
		lotNumber: { type: String },
		laneItem: { type: String },
		saleName: { type: String },
		location: { type: String },
		engineVerified: { type: Boolean, default: false },
		engineVerifiedNote: { type: String },
		engineStatus: { type: String },
		transmissionEngages: { type: Boolean, default: false },
		transmissionNote: { type: String },
		titleCode: { type: String },
		vehicleTitleType: { type: String },
		odometer: { type: Number },
		odometerUnit: { type: String, enum: ['mi', 'km'] },
		odometerStatus: { type: String },
		primaryDamage: { type: String },
		cylinders: { type: String },
		color: { type: String },
		hasKey: { type: Boolean, default: false },
		engineType: { type: String },
		transmission: { type: String },
		vehicleType: { type: String },
		driveTrain: { type: String },
		fuelType: { type: String },
		saleDate: { type: String },
		highlights: { type: [String], default: [] },
		notes: { type: String },
		lastUpdated: { type: String },
		currentBid: { type: Number },
		buyItNow: { type: Number, default: null },
		auctionName: { type: String },
		auctionCountdown: { type: String },
		images: { type: [String], default: [] },
	},
	{ _id: false },
);

const CalendarAuctionSchema = new Schema({
	location: { type: String, required: true },
	saleDate: { type: String, required: true },
	saleTime: { type: String },
	viewSalesLink: { type: String, required: true },
	numberOnSale: { type: Number },
	LotDetails: { type: [LotDetailsSchema], default: [] },
});

const CalendarMonthSchema = new Schema<CalendarMonthDoc>(
	{
		month: { type: String, required: true, index: true },
		year: { type: Number, required: true, index: true },
		scrapedAt: { type: Date, required: true },
		totalAuctions: { type: Number, required: true },
		auctions: { type: [CalendarAuctionSchema], default: [] },
	},
	{ timestamps: true },
);

const CalendarMonth: Model<CalendarMonthDoc> = mongoose.models.CalendarMonth || mongoose.model<CalendarMonthDoc>('CalendarMonth', CalendarMonthSchema);

function inferYearFromAuctions(auctions: CalendarAuction[], fallbackYear = new Date().getFullYear()) {
	for (const a of auctions) {
		// YYYY-MM-DD
		const m = (a.saleDate || '').match(/(\d{4})-(\d{2})-(\d{2})/);
		if (m) return parseInt(m[1], 10);
		// epoch ms
		if (/^\d{10,}$/.test(a.saleDate || '')) {
			const d = new Date(parseInt(a.saleDate, 10));
			if (!isNaN(d.getTime())) return d.getFullYear();
		}
	}
	return fallbackYear;
}

export async function saveCalendarMonth(month: string, auctions: CalendarAuction[]) {
	await connectDB();
	const year = inferYearFromAuctions(auctions);
	const payload: CalendarMonthDoc = {
		month,
		year,
		scrapedAt: new Date(),
		totalAuctions: auctions.length,
		auctions,
	};
	await CalendarMonth.updateOne({ month, year }, { $set: payload }, { upsert: true });
	return { month, year, total: auctions.length };
}

export async function getCalendarMonth(month: string, year: number) {
	await connectDB();
	return CalendarMonth.findOne({ month, year }).lean();
}
