import { create } from 'zustand';
import { Select_Filters } from '@/lib/types/searchFilters-type';

const multiSelectToggle = (option: string, array: string[] | string) => {
	if (Array.isArray(array)) {
		if (array.includes(option)) {
			return array.filter((item: string) => item !== option);
		} else {
			return [...array, option];
		}
	} else if (typeof array === 'string') {
		return array === option ? '' : option;
	}
};

export const filter_Results_State = create<{ searchFilters: Select_Filters; SET_Filter: (filters: string, label: string, multiselect: boolean) => void }>((set) => ({
	searchFilters: {
		sort: '',
		title: [],
		year: [],
		make: '',
		model: [],
		trim: [],
		runAndDrive: [],
		vin: [],
		lotNumber: [],
		laneItem: [],
		saleName: [],
		location: [],
		engineVerified: [],
		engineVerifiedNote: [],
		engineStatus: [],
		transmissionEngages: [],
		transmissionNote: [],
		titleCode: [],
		titleStatus: [],
		odometer: [],
		odometerUnit: [],
		odometerStatus: [],
		primaryDamage: [],
		cylinders: [],
		color: [],
		hasKey: [],
		engineType: [],
		transmission: [],
		vehicleType: [],
		drivetrain: [],
		fuel: [],
		saleDate: [],
		highlights: [],
		notes: [],
		lastUpdated: [],
		currentBid: [],
		buyItNow: [],
		auctionCountdown: [],
		images: [],
	},
	SET_Filter: (filters: string, label: string, multiselect) => {
		set((state) => {
			if (multiselect) {
				return {
					searchFilters: {
						...state.searchFilters,
						[label]: multiSelectToggle(filters, state.searchFilters[label]),
					},
				};
			} else {
				return {
					searchFilters: {
						...state.searchFilters,
						[label]: [filters],
					},
				};
			}
		});
	},
}));
