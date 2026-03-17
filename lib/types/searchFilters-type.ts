import { OdometerUnit } from './lotDetails-type';

export interface SearchFilters {
	sort: string;
	title: string[];
	year: number[]; // Or a range type if preferred
	make: string;
	model: string[];
	trim: string[];
	bodyStyle: string[];
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
	vehicleTitleType: string[];
	vehicleConditionType: string[];
	odometer: number[]; // Or range
	odometerUnit: OdometerUnit[];
	odometerStatus: string[];
	primaryDamage: string[];
	cylinders: string[];
	color: string[];
	hasKey: boolean[];
	engineType: string[];
	transmission: string[];
	vehicleType: string[];
	driveTrain: string[];
	fuelType: string[];
	saleDate: string[]; // Or date range
	highlights: string[][]; // Array of arrays if needed
	notes: string[];
	lastUpdated: string[];
	currentBid: number[]; // Or range
	buyItNow: number[] | null[]; // Or range
	auctionCountdown: string[];
	auctionName: string[];
	images: string[]; // Array of arrays if needed
}
