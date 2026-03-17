import { create } from 'zustand';
import { SearchFilters } from '@/lib/types/searchFilters-type';
import _ from 'lodash';

type SearchFilterKey = keyof SearchFilters;

const isSearchFilterKey = (key: string): key is SearchFilterKey => {
	return key in initialSearchFilters;
};

const selectToggle = <T extends SearchFilters[SearchFilterKey]>(option: string, currentValue: T): T => {
	if (Array.isArray(currentValue)) {
		const exists = currentValue.some((item) => String(item) === option);
		if (exists) {
			return currentValue.filter((item) => String(item) !== option) as T;
		}
		return [...currentValue, option as unknown as (typeof currentValue)[number]] as T;
	}

	if (typeof currentValue === 'string') {
		return (currentValue === option ? '' : option) as T;
	}

	return currentValue;
};

const initialSearchFilters: SearchFilters = {
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
	searchFilters: SearchFilters;
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
