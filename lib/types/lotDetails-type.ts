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
	lotNumber: string | null;
	laneItem: string | null; // e.g. "-/-"
	saleName: string | null;
	location: string | null;
	engineVerified: boolean | null;
	engineVerifiedNote: string | null; // e.g. "Copart verified that the engine starts."
	engineStatus: string | null; // e.g. "Engine Starts"
	transmissionEngages: boolean | null;
	transmissionNote: string | null; // e.g. "Copart verified that the transmission engages."
	titleCode: string | null; // e.g. "PA - Cert Of Title"
	vehicleTitleType: string | null; // e.g. "Title Absent"
	odometer: string | null;
	odometerUnit: string | null;
	odometerStatus: string | null; // e.g. "Not Actual"
	primaryDamage: string | null; // e.g. "Normal Wear"
	cylinders: string | null;
	color: string | null;
	hasKey: boolean | null;
	engineType: string | null; // e.g. "2.0L 4"
	transmission: string | null; // e.g. "Automatic"
	vehicleType: string | null; // e.g. "Medium Duty/box Trucks"
	driveTrain: string | null; // e.g. "Rear-wheel drive"
	fuelType: string | null; // e.g. "Diesel"
	saleDate: string | null; // e.g. "Thu. Feb 05, 2026 02:00 AM GMT"
	highlights: string[] | string | null;
	notes: string | null;
	lastUpdated: string | null; // e.g. "02/03/2026 12:27 am"
	currentBid: string | null;
	buyItNow: string | null;
	auctionName: string | null;
	auctionCountdown: string | null; // e.g. "0D 16H 10min"
	images: {
		copart: string[] | null;
		AiRepaired: Buffer[] | null;
	};
	copartLink: string | null;
}

export interface scrapedLotDataType {
	scrapedLotObj: LotDetailsType;
	scrapingInfo: {
		Success: number;
		Failed: number;
		failedSelectors: string[];
		Url: string;
	};
}
