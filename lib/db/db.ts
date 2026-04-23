import mongoose from 'mongoose';
import 'dotenv/config';
import MonthSaleModel from './models';
import { CalendarMonthType } from '@/lib/types/calendar-type';
import { SaleListType } from '@/lib/types/calendar-type';
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

export async function saveSalesList(_id: string, SalesList: LotDetailsType) {
	const nestedId = new mongoose.Types.ObjectId(_id);
	await connectDB();
	// Example of updating a nested auction

	try {
		if (nestedId && SalesList) {
			await MonthSaleModel.updateOne({ _id: nestedId }, { $push: { 'auctions.$.lotList': SalesList } });

			console.log('Data saved to sale list and db updated');
		} else {
			console.log('There is no sales Id or updated sales list to be saved!!');
		}
	} catch (e) {
		console.log(e);
	}

	try {
		if (nestedId && SalesList) {
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

export async function saveOneSale() {
	await connectDB();
	const lot = [
		{
			title: 'KIA SOUL LX',
			year: '2021',
			make: null,
			model: null,
			trim: null,
			bodyStyle: null,
			runAndDrive: null,
			vin: null,
			lotNumber: '99940955',
			laneItem: '-/-',
			saleName: 'CT - HARTFORD',
			location: 'CT - HARTFORD',
			engineVerified: null,
			engineVerifiedNote: null,
			engineStatus: null,
			transmissionEngages: null,
			transmissionNote: null,
			titleCode: 'CT - Cert Of Title-salvage',
			vehicleTitleType: null,
			odometer: '78,008',
			odometerUnit: 'miles',
			odometerStatus: 'Actual',
			primaryDamage: 'Front End',
			cylinders: '4',
			color: 'Silver',
			hasKey: 'Yes',
			engineType: '2.0L  4',
			transmission: 'Automatic',
			vehicleType: 'Automobile',
			driveTrain: null,
			fuelType: null,
			saleDate: 'Fri. Apr 24, 2026 03:00 PM GMT+1',
			highlights: 'Enhanced Vehicles',
			notes: 'There are no notes for this lot',
			lastUpdated: null,
			currentBid: '1,200',
			buyItNow: null,
			auctionName: null,
			auctionCountdown: '0D 19H 14min',
			images: {
				copart: [
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/2a4f9d88fcaf4225b3fb6afdc61a5af6_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/edd61afa91ea414c8d9609d4937dc54e_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/525f54f4435f4cec9fa55e5da7354192_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/60dd6c13a9bc4504bb675002fa9005ca_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/f66f6e04497a49e3a21f104f1062ac20_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/50909cc73af04fa49734e42661676344_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/f9f111e6cc1c4435bddb8130d38038a3_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/419ffad9014c4c7ebfd70fdd0bc6e87c_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/fba88586e45d4342ad07b1d2674421ad_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/602ec616939f40e4a2a63a7d6ac79756_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/f89385ab68e449cd9531d9e1d54d506f_ful.jpg',
					'https://cs.copart.com/v1/AUTH_svc.pdoc00001/ids-c-prod-lpp/1025/99b629cb59bf4cea877e5eab9be611ab_ful.jpg',
				],
				AiRepaired: [],
			},
			copartLink: 'https://www.copart.com/lot/99940955/salvage-2021-kia-soul-lx-ct-hartford',
		},
	];

	const parentId = new mongoose.Types.ObjectId('69e8914d2f2be50e2cecd373'); // main document _id
	const auctionId = new mongoose.Types.ObjectId('69e8914d2f2be50e2cecd3f4'); // nested auction _id
	const newLotList = [...lot];

	await MonthSaleModel.updateOne({ _id: parentId, 'auctions._id': auctionId }, { $push: { 'auctions.$.lotList': newLotList } });
}
