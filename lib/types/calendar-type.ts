import { LotDetailsType } from '@/lib/types/lotDetails-type';

export type CalendarMonthType = {
	month: string | null;
	year: number | null;
	scrapedAt: Date | null;
	totalAuctions: number | null;
	auctions: SaleListType[];
};

export type SaleListType = {
	saleTime: string | null;
	saleName: string | null;
	saleType: string | null;
	currentSale: string | null;
	currentSaleUrl: string | null;
	nextSale: string | null;
	nextSaleUrl: string | null;
	lotList: LotDetailsType[];
	buyItNow: number | null;
	scrapedAt: string | null;
};

export const createEmptyCalendarList = (): CalendarMonthType => ({
	month: null,
	year: null,
	scrapedAt: null,
	totalAuctions: null,
	auctions: [],
});
export const createEmptySaleList = (): SaleListType => ({
	saleTime: null,
	saleName: null,
	saleType: null,
	currentSale: null,
	currentSaleUrl: null,
	nextSale: null,
	nextSaleUrl: null,
	lotList: [],
	buyItNow: null,
	scrapedAt: null,
});
