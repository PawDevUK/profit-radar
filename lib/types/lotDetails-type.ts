export type OdometerUnit = 'mi' | 'km';

export interface LotDetails {
	title: string;
	year: number;
	make: string;
	model: string;
	trim: string;
	bodyStyle: string;
	runAndDrive: boolean;
	vin: string;
	lotNumber: string;
	laneItem: string; // e.g. "-/-"
	saleName: string;
	location: string;
	engineVerified: boolean;
	engineVerifiedNote: string; // e.g. "Copart verified that the engine starts."
	engineStatus: string; // e.g. "Engine Starts"
	transmissionEngages: boolean;
	transmissionNote: string; // e.g. "Copart verified that the transmission engages."
	titleCode: string; // e.g. "PA - Cert Of Title"
	vehicleTitleType: string; // e.g. "Title Absent"
	odometer: number;
	odometerUnit: string;
	odometerStatus: string; // e.g. "Not Actual"
	primaryDamage: string; // e.g. "Normal Wear"
	cylinders: string;
	color: string;
	hasKey: boolean;
	engineType: string; // e.g. "2.0L 4"
	transmission: string; // e.g. "Automatic"
	vehicleType: string; // e.g. "Medium Duty/box Trucks"
	driveTrain: string; // e.g. "Rear-wheel drive"
	fuelType: string; // e.g. "Diesel"
	saleDate: string; // e.g. "Thu. Feb 05, 2026 02:00 AM GMT"
	highlights: string[];
	notes: string;
	lastUpdated: string; // e.g. "02/03/2026 12:27 am"
	currentBid: number;
	buyItNow: number | null;
	auctionName: string;
	auctionCountdown: string; // e.g. "0D 16H 10min"
	images: string[]; // image URLs
}
