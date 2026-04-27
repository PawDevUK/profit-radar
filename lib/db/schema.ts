import { Schema } from 'mongoose';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { SaleListType, CalendarMonthType } from '@/lib/types/calendar-type';

export const LotDetailsSchema = new Schema<LotDetailsType>(
	{
		title: { type: String },
		year: { type: Number },
		make: { type: String },
		model: { type: String },
		trim: { type: String },
		bodyStyle: { type: String },
		runAndDrive: { type: Boolean },
		vin: { type: String },
		lotNumber: { type: String },
		laneItem: { type: String },
		saleName: { type: String },
		location: { type: String },
		engineVerified: { type: Boolean },
		engineVerifiedNote: { type: String },
		engineStatus: { type: String },
		transmissionEngages: { type: Boolean, default: false },
		transmissionNote: { type: String },
		titleCode: { type: String },
		vehicleTitleType: { type: String },
		odometer: { type: String },
		odometerUnit: { type: String, enum: ['mi', 'km'] },
		odometerStatus: { type: String },
		primaryDamage: { type: String },
		cylinders: { type: String },
		color: { type: String },
		hasKey: { type: String, default: false },
		engineType: { type: String },
		transmission: { type: String },
		vehicleType: { type: String },
		driveTrain: { type: String },
		fuelType: { type: String },
		saleDate: { type: String },
		highlights: { type: [String], default: [] },
		notes: { type: String },
		lastUpdated: { type: String },
		currentBid: { type: String },
		buyItNow: { type: Number, default: null },
		auctionName: { type: String },
		auctionCountdown: { type: String },
		images: [
			{
				copart: { type: [String] }, // Keep as URL or change to Buffer if storing binary
				AiRepaired: { type: [Buffer] }, // Binary data for repaired image
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
		numOfLots: { type: Number },
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
