import { Schema } from 'mongoose';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { SaleListType, CalendarMonthType } from '@/lib/types/calendar-type';

export const LotDetailsSchema = new Schema<LotDetailsType>(
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
		images: [
			{
				copart: { type: String }, // Keep as URL or change to Buffer if storing binary
				AiRepaired: { type: Buffer }, // Binary data for repaired image
				repairedMimeType: { type: String }, // e.g., 'image/png'
			},
		],
	},
	{ _id: false },
);

export const SaleListSchema = new Schema<SaleListType>(
	{
		saleTime: { type: String, required: true },
		saleName: { type: String, required: true },
		saleType: { type: String },
		nextSale: { type: String },
		nextSaleUrl: { type: String },
		currentSale: { type: String, required: true },
		currentSaleUrl: { type: String },
		lotList: [LotDetailsSchema],
		scrapedAt: { type: Date },
		buyItNow: { type: Number },
	},
	{ timestamps: true },
);

export const MonthSaleSchema = new Schema<CalendarMonthType>({
	month: { type: String },
	year: { type: Number },
	scrapedAt: { type: Date },
	totalAuctions: { type: Number },
	auctions: [SaleListSchema],
});
