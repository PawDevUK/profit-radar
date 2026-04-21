import { LotDetails } from '@/lib/types/lotDetails-type';

export type CalendarMonthDoc = {
	month: string;
	year: number;
	scrapedAt: Date;
	totalAuctions: number;
	auctions: SaleList[];
};

export type SaleList = {
	saleTime: string;
	saleName: string;
	saleType: string;
	currentSale: string;
	nextSale: string;
	totalLots: number;
	lots: LotDetails[];
	buyItNow: number;
	scrapedAt: Date;
};
