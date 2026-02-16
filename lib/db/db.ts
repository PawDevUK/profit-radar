import mongoose, { Schema, Model } from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
import { CalendarAuction, CalendarMonthDoc } from '../types/calendar';
import { SaleList } from '../types/saleList';
import { LotDetails } from '../types/lot-details';

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

// Lot details schema mirrors lib/types/lot-details.ts
const LotDetailsSchema = new Schema<LotDetails>(
	{
		title: { type: String, required: true },
		year: { type: Number, required: true },
		make: { type: String, required: true },
		model: { type: String, required: true },
		trim: { type: String, required: true },
		runAndDrive: { type: Boolean, default: false },
		vin: { type: String, required: true },
		lotNumber: { type: Number },
		laneItem: { type: String },
		saleName: { type: String },
		location: { type: String },
		engineVerified: { type: Boolean, default: false },
		engineVerifiedNote: { type: String },
		engineStatus: { type: String },
		transmissionEngages: { type: Boolean, default: false },
		transmissionNote: { type: String },
		titleCode: { type: String },
		titleStatus: { type: String },
		odometer: { type: Number },
		odometerUnit: { type: String, enum: ['mi', 'km'] },
		odometerStatus: { type: String },
		primaryDamage: { type: String },
		cylinders: { type: Number },
		color: { type: String },
		hasKey: { type: Boolean, default: false },
		engineType: { type: String },
		transmission: { type: String },
		vehicleType: { type: String },
		drivetrain: { type: String },
		fuel: { type: String },
		saleDate: { type: String },
		highlights: { type: [String], default: [] },
		notes: { type: String },
		lastUpdated: { type: String },
		currentBid: { type: Number },
		buyItNow: { type: Number, default: null },
		auctionCountdown: { type: String },
		images: { type: [String], default: [] },
	},
	{ _id: false },
);

// Sale list schema mirrors lib/types/saleList.ts
const SaleListSchema = new Schema<SaleList>(
	{
		title: { type: String },
		lotNr: { type: String },
		odometer: { type: String },
		odometerStatus: { type: String },
		EstimateRetail: { type: String },
		conditionTitle: { type: String },
		damage: { type: String },
		keys: { type: String },
		location: { type: String },
		yardLocation: { type: String },
		item: { type: String },
		actionCountDown: { type: String },
		currentBid: { type: String },
		buyItNow: { type: String },
		details: { type: LotDetailsSchema },
	},
	{ _id: false },
);

const CalendarAuctionSchema = new Schema<CalendarAuction>({
	location: { type: String, required: true },
	saleDate: { type: String, required: true },
	saleTime: { type: String },
	viewSalesLink: { type: String, required: true },
	numberOnSale: { type: Number },
	saleList: { type: [SaleListSchema], default: [] },
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

// Attach sale list to a specific auction by matching its viewSalesLink
export async function attachSaleListToAuctionByLink(viewSalesLink: string, saleList: SaleList[]) {
	await connectDB();
	const res = await CalendarMonth.updateOne(
		{ 'auctions.viewSalesLink': viewSalesLink },
		{
			$set: {
				'auctions.$.saleList': saleList,
				'auctions.$.numberOnSale': Array.isArray(saleList) ? saleList.length : undefined,
			},
		},
		{ upsert: false },
	);
	return res.modifiedCount || res.upsertedCount || 0;
}

// Incremental merge: update only missing fields and rolling fields for sale list items
export async function incrementalAttachSaleListByLink(viewSalesLink: string, newSaleList: SaleList[]) {
	await connectDB();
	// Fetch current month doc containing the auction
	const doc = await CalendarMonth.findOne({ 'auctions.viewSalesLink': viewSalesLink }).lean();
	if (!doc) {
		// If not found, fallback to full attach
		return attachSaleListToAuctionByLink(viewSalesLink, newSaleList);
	}

	// Find auction index
	const idx = (doc.auctions || []).findIndex((a) => a.viewSalesLink === viewSalesLink);
	if (idx < 0) {
		return 0;
	}

	const existingList: SaleList[] = (doc.auctions[idx].saleList || []) as SaleList[];

	// Build index by stable identifier (prefer lotNr, then VIN, then lotNumber)
	const keyOf = (s: SaleList) => {
		const vin = s?.details?.vin || '';
		const lotNumber = String(s?.details?.lotNumber || '').trim();
		const lotNr = String(s?.lotNr || '').trim();
		return (lotNr && `lotNr:${lotNr}`) || (vin && `vin:${vin}`) || (lotNumber && `lot:${lotNumber}`) || `title:${(s.title || '').trim()}`;
	};

	const existingMap = new Map<string, SaleList>();
	for (const e of existingList) existingMap.set(keyOf(e), e);

	const merged: SaleList[] = [...existingList];
	let changes = 0;

	for (const n of newSaleList) {
		const k = keyOf(n);
		const e = existingMap.get(k);
		if (!e) {
			merged.push(n);
			existingMap.set(k, n);
			changes++;
			continue;
		}

		// Rolling fields that can be updated even if present
		const rollingFields: (keyof SaleList)[] = ['currentBid', 'buyItNow', 'actionCountDown'];
		for (const f of rollingFields) {
			const nv = n[f];
			const ev = e[f];
			if (typeof nv === 'string' && nv !== '' && nv !== ev) {
				// @ts-expect-error: TypeScript can't guarantee at compile time, but we know f is a string field
				e[f] = nv;
				changes++;
			}
		}

		// Enrich missing top-level fields
		const enrichTop: (keyof SaleList)[] = ['odometer', 'odometerStatus', 'EstimateRetail', 'conditionTitle', 'damage', 'keys', 'location', 'yardLocation', 'item'];
		function setSaleListField(obj: SaleList, key: keyof SaleList, value: string) {
			// Only assign to string fields
			(obj[key] as unknown as string) = value;
		}
		for (const f of enrichTop) {
			const ev = e[f];
			const nv = n[f];
			if ((ev === undefined || ev === null || ev === '') && nv) {
				setSaleListField(e, f, nv as string);
				changes++;
			}
		}

		// Merge lot details: fill missing fields, update rolling price/countdown
		if (n.details) {
			if (!e.details) e.details = {} as LotDetails;
			const dFields: (keyof LotDetails)[] = [
				'title',
				'year',
				'make',
				'model',
				'trim',
				'runAndDrive',
				'vin',
				'lotNumber',
				'laneItem',
				'saleName',
				'location',
				'engineVerified',
				'engineVerifiedNote',
				'engineStatus',
				'transmissionEngages',
				'transmissionNote',
				'titleCode',
				'titleStatus',
				'odometer',
				'odometerUnit',
				'odometerStatus',
				'primaryDamage',
				'cylinders',
				'color',
				'hasKey',
				'engineType',
				'transmission',
				'vehicleType',
				'drivetrain',
				'fuel',
				'saleDate',
				'highlights',
				'notes',
			] as const;
			for (const f of dFields) {
				const ev = e.details[f];
				const nv = n.details[f];
				const isEmpty = ev === undefined || ev === null || ev === '' || (Array.isArray(ev) && ev.length === 0);
				if (isEmpty && nv !== undefined && nv !== null && !(Array.isArray(nv) && nv.length === 0)) {
					(e.details as Record<typeof f, typeof nv>)[f] = nv;
					changes++;
				}
			}
			// Rolling in details
			if (n.details.currentBid && n.details.currentBid !== e.details.currentBid) {
				e.details.currentBid = n.details.currentBid;
				changes++;
			}
			if (n.details.buyItNow !== undefined && n.details.buyItNow !== e.details.buyItNow) {
				e.details.buyItNow = n.details.buyItNow;
				changes++;
			}
			if (n.details.auctionCountdown && n.details.auctionCountdown !== e.details.auctionCountdown) {
				e.details.auctionCountdown = n.details.auctionCountdown;
				changes++;
			}
			// Merge images: append new ones
			const imgs = new Set([...(e.details.images || []), ...(n.details.images || [])]);
			if (imgs.size !== (e.details.images || []).length) {
				e.details.images = Array.from(imgs);
				changes++;
			}
			// Update lastUpdated timestamp
			e.details.lastUpdated = new Date().toISOString();
		}
	}

	// Perform update only if changes detected
	if (changes > 0) {
		const res = await CalendarMonth.updateOne(
			{ 'auctions.viewSalesLink': viewSalesLink },
			{
				$set: {
					'auctions.$.saleList': merged,
					// numberOnSale based on latest scrape size, not merged size
					'auctions.$.numberOnSale': Array.isArray(newSaleList) ? newSaleList.length : undefined,
				},
			},
			{ upsert: false },
		);
		return res.modifiedCount || res.upsertedCount || 0;
	}
	return 0;
}
