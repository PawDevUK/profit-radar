import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

export type OdometerUnit = 'mi' | 'km';

export interface LotDetailsType {
	title: string | null;
	year: string | null;
	make: string | null;
	model: string | null;
	trim: string | null;
	bodyStyle: string | null;
	runAndDrive: boolean | null;
	vin: string | null;
	lotInv: string | null;
	saleId: string | null;
	laneItem: string | null;
	saleName: string | null;
	location: string | null;
	engineVerified: boolean | null;
	engineVerifiedNote: string | null;
	engineStatus: string | null;
	transmissionEngages: boolean | null;
	transmissionNote: string | null;
	titleCode: string | null;
	vehicleTitleType: string | null;
	odometer: string | null;
	odometerUnit: OdometerUnit | null;
	odometerDescription: string | null;
	damageDescription: string | null;
	cylinders: string | null;
	color: string | null;
	hasKey: boolean | null;
	engineType: string | null;
	transmission: string | null;
	vehicleType: string | null;
	driveTrain: string | null;
	fuelType: string | null;
	saleDate: string | null;
	highlights: string[] | string | null;
	notes: string | null;
	lastUpdated: string | null;
	currentBid: string | null;
	buyItNow: string | null;
	myBid: string | null;
	itemNumber: string | null;
	estRetailValue: string | null;
	auctionName: string | null;
	saleLight: string | null;
	announcements: string | null;
	autoGrade: string | null;
	auctionCountdown: string | null;
	images: {
		copart: string[] | null;
		AiRepaired: Buffer[] | null;
	};
	lotUrl: string | null;
}

export function createLotObject() {
	return {
		title: null,
		year: null,
		make: null,
		model: null,
		trim: null,
		bodyStyle: null,
		runAndDrive: null,
		vin: null,
		lotInv: null,
		saleId: null,
		laneItem: null,
		saleName: null,
		location: null,
		engineVerified: null,
		engineVerifiedNote: null,
		engineStatus: null,
		transmissionEngages: null,
		transmissionNote: null,
		titleCode: null,
		vehicleTitleType: null,
		odometer: null,
		odometerUnit: null,
		odometerDescription: null,
		damageDescription: null,
		cylinders: null,
		color: null,
		hasKey: null,
		engineType: null,
		transmission: null,
		vehicleType: null,
		driveTrain: null,
		fuelType: null,
		saleDate: null,
		highlights: null,
		notes: null,
		lastUpdated: null,
		currentBid: null,
		buyItNow: null,
		auctionName: null,
		auctionCountdown: null,
		images: {
			copart: null,
			AiRepaired: null,
		},
		lotUrl: null,
	};
}
