import { create } from 'zustand';
import { Select_Filters } from '@/lib/types/searchFilters-type';
import _ from 'lodash';

type SearchFilterKey = keyof Select_Filters;

const isSearchFilterKey = (key: string): key is SearchFilterKey => {
	return key in initialSearchFilters;
};

const selectToggle = (option: string, array: string[] | string): string[] | string => {
	if (Array.isArray(array)) {
		if (array.includes(option)) {
			return array.filter((item: string) => item !== option);
		}
		return [...array, option];
	}

	return array === option ? '' : option;
};

const initialSearchFilters: Select_Filters = {
	sort: 'Relevance',
	title: [],
	year: [],
	make: '',
	model: [],
	trim: [],
	bodyStyle: [],
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
	odometer: [],
	vehicleTitleType: [],
	vehicleConditionType: [],
	odometerUnit: [],
	odometerStatus: [],
	primaryDamage: [],
	cylinders: [],
	color: [],
	hasKey: [],
	engineType: [],
	transmission: [],
	vehicleType: [],
	driveTrain: [],
	fuelType: [],
	saleDate: [],
	highlights: [],
	notes: [],
	lastUpdated: [],
	currentBid: [],
	buyItNow: [],
	auctionCountdown: [],
	auctionName: [],
	images: [],
};

interface FilterResultsState {
	searchFilters: Select_Filters;
	SET_Filter: (filters: string, label: string) => void;
}

export const filter_Results_State = create<FilterResultsState>((set) => ({
	searchFilters: initialSearchFilters,
	SET_Filter: (filters: string, label: string) => {
		const labelCamelCase = _.camelCase(label);
		console.log('Title:', label, '----- >', labelCamelCase, 'Option:', filters);

		if (!isSearchFilterKey(labelCamelCase)) {
			console.warn(`Invalid search filter key: ${labelCamelCase}`);
			return;
		}

		set((state) => ({
			searchFilters: {
				...state.searchFilters,
				[labelCamelCase]: selectToggle(filters, state.searchFilters[labelCamelCase]),
			},
		}));
	},
}));
