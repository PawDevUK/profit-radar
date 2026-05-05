import { Schema } from 'mongoose';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { SaleListType, CalendarType } from '@/lib/types/calendar-type';

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
		lotInv: { type: String },
		saleId: { type: String },
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
		odometerDescription: { type: String },
		damageDescription: { type: String },
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
		buyItNow: { type: String, default: null },
		myBid: { type: String },
		itemNumber: { type: String },
		estRetailValue: { type: String },
		auctionName: { type: String },
		saleLight: { type: String },
		announcements: { type: String },
		autoGrade: { type: String },
		auctionCountdown: { type: String },
		lotUrl: { type: String },
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
		saleTime: { type: String },
		saleName: { type: String },
		saleType: { type: String },
		nextSale: { type: String },
		nextSaleUrl: { type: String },
		currentSale: { type: String },
		currentSaleUrl: { type: String },
		saleId: { type: String },
		numOfLots: { type: Number },
		scrapedAt: { type: Date },
		buyItNow: { type: Number },
	},
	{ timestamps: true },
);

export const CalendarSaleSchema = new Schema<CalendarType>({
	scrapedAt: { type: Date },
	totalAuctions: { type: Number },
	auctions: [SaleListSchema],
});
