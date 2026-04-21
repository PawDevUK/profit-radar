import { LotDetailsType } from '@/lib/types/lotDetails-type';

export type CalendarMonthType = {
	month: string;
	year: number;
	scrapedAt: Date;
	totalAuctions: number;
	auctions: SaleListType[];
};

export type SaleListType = {
	saleTime: string;
	saleName: string;
	saleType: string;
	currentSale: string;
	nextSale: string;
	totalLots: number;
	lots: LotDetailsType[];
	buyItNow: number;
	scrapedAt: Date;
};
