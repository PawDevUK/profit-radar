import { create } from 'zustand';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

type AllCarsState = {
	allCars: LotDetailsType[];
	isLoading: boolean;
	error: string | null;
	hasLoaded: boolean;
	fetchAllSaleLists: () => Promise<void>;
	reset: () => void;
};

const useAllCarsStore = create<AllCarsState>((set, get) => ({
	allCars: [],
	isLoading: false,
	error: null,
	hasLoaded: false,
	fetchAllSaleLists: async () => {
		if (get().isLoading) {
			console.log('⚠️ Fetch already in progress, skipping');
			return;
		}
		set({ isLoading: true, error: null });
		console.log('🔄 Starting fetch...');
		try {
			const response = await fetch('/api/copart/db/getAllLots', { cache: 'no-store' });
			if (!response.ok) {
				throw new Error(`Failed to fetch sale lists: ${response.status}`);
			}
			const payload = await response.json();
			const cars = payload.data;
			console.log('✅ Fetch completed, got', cars.length, 'cars');
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

export const useAllCars = () => useAllCarsStore((state) => state.allCars);
export const useIsLoading = () => useAllCarsStore((state) => state.isLoading);
export const useError = () => useAllCarsStore((state) => state.error);
export const useFetchAllSaleLists = () => useAllCarsStore((state) => state.fetchAllSaleLists);
export const useHasLoaded = () => useAllCarsStore((state) => state.hasLoaded);
