import { LotDetails } from './lot-details';

export type SaleList = {
	title: string;
	lotNr: string;
	odometer: string;
	odometerStatus: string;
	EstimateRetail: string;
	conditionTitle: string;
	damage: string;
	keys: string;
	location: string;
	yardLocation: string;
	item: string;
	actionCountDown: string;
	currentBid: string;
	buyItNow: string;
	details: LotDetails | null;
};
