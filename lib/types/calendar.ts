import { SaleList } from './saleList';

export type CalendarAuction = {
	location: string;
	saleDate: string;
	saleTime?: string;
	viewSalesLink: string;
	numberOnSale?: number;
	saleList?: SaleList[];
};

export type CalendarMonthDoc = {
	month: string;
	year: number;
	scrapedAt: Date;
	totalAuctions: number;
	auctions: CalendarAuction[];
};
