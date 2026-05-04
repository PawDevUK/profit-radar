export type CalendarType = {
	scrapedAt: Date | null;
	totalAuctions: number | null;
	auctions: SaleListType[];
};

export type SaleListType = {
	saleTime: string | null;
	saleName: string | null;
	saleType: string | null;
	currentSale: string | null | Date;
	currentSaleUrl: string | null;
	nextSale: string | null;
	nextSaleUrl: string | null;
	saleId: string | null;
	numOfLots: number | null;
	buyItNow: number | null;
	scrapedAt: string | null;
	_id?: string;
};

export const createEmptyCalendarList = (): CalendarType => ({
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
	saleId: null,
	numOfLots: null,
	buyItNow: null,
	scrapedAt: null,
});
