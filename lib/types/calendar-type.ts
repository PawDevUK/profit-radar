import { LotDetails } from '@/lib/types/lotDetails-type';

export type CalendarAuction = {
	location: string;
	saleDate: string;
	saleTime?: string;
	viewSalesLink: string;
	numberOnSale?: number;
	saleList?: LotDetails[];
};

export type CalendarMonthDoc = {
	month: string;
	year: number;
	scrapedAt: Date;
	totalAuctions: number;
	auctions: CalendarAuction[];
};
