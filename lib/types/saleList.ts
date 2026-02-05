import { LotDetails } from './lot-details';

export type SaleList = {
	title: string;
	lotNr: string;
	odometr: string;
	odometrStatus: string;
	EstimateRetail: string;
	condionTitle: string;
	damage: string;
	keys: string;
	location: string;
	yeardLocation: string;
	item: string;
	actionCountDown: string;
	currentBid: string;
	buyItNow: string;
	details: LotDetails;
};
