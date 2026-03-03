import { LotDetails } from './lot-details';

export type SaleList = {
	title: string;
	year?: number | string;
	make?: string;
	model?: string;
	vin?: string;
	images: string[];
	lotNumber: number;
	odometer: number | string;
	odometerStatus: string;
	estimateRetail: string;
	titleCode: string;
	primaryDamage: string;
	hasKey: boolean;
	location: string;
	saleName: string;
	laneItem: string;
	auctionCountdown: string;
	currentBid: number;
	buyItNow: number | null;
	details: LotDetails | null;
};
