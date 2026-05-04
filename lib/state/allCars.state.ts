import { create } from 'zustand';
import { CalendarType, SaleListType } from '@/lib/types/calendar-type';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

type AllCarsState = {
	calendarMonths: CalendarType[];
	saleLists: SaleListType[];
	allCars: LotDetailsType[];
	isLoading: boolean;
	error: string | null;
	hasLoaded: boolean;
	fetchAllSaleLists: () => Promise<void>;
	reset: () => void;
};

const isCalendarMonthArray = (value: unknown): value is CalendarType[] => {
	if (!Array.isArray(value)) return false;
	return value.every((month) => typeof month === 'object' && month !== null && Array.isArray((month as CalendarType).auctions));
};

const unwrapCalendarMonths = (payload: unknown): CalendarType[] => {
	if (isCalendarMonthArray(payload)) return payload;

	if (payload && typeof payload === 'object' && 'data' in payload) {
		const data = (payload as { data?: unknown }).data;
		if (isCalendarMonthArray(data)) {
			return data;
		}
	}

	return [];
};

const flattenSaleLists = (months: CalendarType[]): SaleListType[] => {
	const allSales: SaleListType[] = [];
	for (const month of months) {
		if (Array.isArray(month.auctions)) {
			allSales.push(...month.auctions);
		}
	}
	return allSales;
};

const flattenCars = (sales: SaleListType[]): LotDetailsType[] => {
	const cars: LotDetailsType[] = [];
	for (const sale of sales) {
		if (Array.isArray(sale.lotList)) {
			cars.push(...sale.lotList);
		}
	}
	return cars;
};

export const allCars_State = create<AllCarsState>((set, get) => ({
	calendarMonths: [],
	saleLists: [],
	allCars: [],
	isLoading: false,
	error: null,
	hasLoaded: false,
	fetchAllSaleLists: async () => {
		if (get().isLoading) return;
		set({ isLoading: true, error: null });
		try {
			const response = await fetch('/api/copart/db/getAllSaleLists', { cache: 'no-store' });
			if (!response.ok) {
				throw new Error(`Failed to fetch sale lists: ${response.status}`);
			}

			const payload: unknown = await response.json();
			const months = unwrapCalendarMonths(payload);
			const sales = flattenSaleLists(months);
			const cars = flattenCars(sales);

			set({
				calendarMonths: months,
				saleLists: sales,
				allCars: cars,
				isLoading: false,
				error: null,
				hasLoaded: true,
			});
		} catch (e) {
			set({
				isLoading: false,
				error: e instanceof Error ? e.message : 'Error fetching sale lists',
			});
		}
	},
	reset: () => {
		set({
			calendarMonths: [],
			saleLists: [],
			allCars: [],
			isLoading: false,
			error: null,
			hasLoaded: false,
		});
	},
}));
