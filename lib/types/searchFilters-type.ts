import { OdometerUnit } from './lotDetails-type';

export interface Select_Filters {
	sort: string;
	title: string[];
	year: number[]; // Or a range type if preferred
	make: string;
	model: string[];
	trim: string[];
	runAndDrive: boolean[]; // Might not make sense as array; consider boolean or null
	vin: string[];
	lotNumber: number[];
	laneItem: string[];
	saleName: string[];
	location: string[];
	engineVerified: boolean[];
	engineVerifiedNote: string[];
	engineStatus: string[];
	transmissionEngages: boolean[];
	transmissionNote: string[];
	titleCode: string[];
	titleStatus: string[];
	odometer: number[]; // Or range
	odometerUnit: OdometerUnit[];
	odometerStatus: string[];
	primaryDamage: string[];
	cylinders: number[];
	color: string[];
	hasKey: boolean[];
	engineType: string[];
	transmission: string[];
	vehicleType: string[];
	drivetrain: string[];
	fuel: string[];
	saleDate: string[]; // Or date range
	highlights: string[][]; // Array of arrays if needed
	notes: string[];
	lastUpdated: string[];
	currentBid: number[]; // Or range
	buyItNow: number[] | null[]; // Or range
	auctionCountdown: string[];
	images: string[]; // Array of arrays if needed
}
export interface SelectOneFilters {
	sort: string;
	title: string;
	year: string;
	make: string;
	model: string;
	trim: string;
	runAndDrive: string;
	vin: string;
	lotNumber: string;
	laneItem: string;
	saleName: string;
	location: string;
	engineVerified: string;
	engineVerifiedNote: string;
	engineStatus: string;
	transmissionEngages: string;
	transmissionNote: string;
	titleCode: string;
	titleStatus: string;
	odometer: string;
	odometerUnit: string;
	odometerStatus: string;
	primaryDamage: string;
	cylinders: string;
	color: string;
	hasKey: string;
	engineType: string;
	transmission: string;
	vehicleType: string;
	drivetrain: string;
	fuel: string;
	saleDate: string;
	highlights: string;
	notes: string;
	lastUpdated: string;
	currentBid: string;
	buyItNow: string;
	auctionCountdown: string;
	images: string;
}
