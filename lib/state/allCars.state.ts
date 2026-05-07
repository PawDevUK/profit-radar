import { create } from 'zustand';
import { LotDetailsType, createLotObject } from '@/lib/types/lotDetails-type';

type AllCarsState = {
	allCars: LotDetailsType[];
	isLoading: boolean;
	error: string | null;
	hasLoaded: boolean;
	fetchAllSaleLists: () => Promise<void>;
	reset: () => void;
};

export const allCars_State = create<AllCarsState>((set, get) => ({
	allCars: [],
	isLoading: false,
	error: null,
	hasLoaded: false,
	fetchAllSaleLists: async () => {
		if (get().isLoading) return;
		set({ isLoading: true, error: null });
		try {
			const response = await fetch('/api/copart/db/getAllLots', { cache: 'no-store' });
			if (!response.ok) {
				throw new Error(`Failed to fetch sale lists: ${response.status}`);
			}
			const payload = await response.json();
			const cars = payload.data;

			set({
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
			allCars: [],
			isLoading: false,
			error: null,
			hasLoaded: false,
		});
	},
}));
