import { create } from 'zustand';
import { SearchFilters } from '@/lib/types/searchFilters-type';
import _ from 'lodash';

type SearchFilterKey = keyof SearchFilters;

export interface makesType {
	make: string;
	models: string[];
}

const isSearchFilterKey = (key: string): key is SearchFilterKey => {
	return key in initialSearchFilters;
};

const getModels = (make: string, makes: makesType[]) => {
	const selectedMakes: string[] = [];
	makes.forEach((element: makesType) => {
		if (element.make === make) {
			selectedMakes.push(...element.models);
		}
	});
	return selectedMakes;
};

const selectToggle = <T extends SearchFilters[SearchFilterKey]>(option: string, currentValue: T, title: string): T => {
	if (Array.isArray(currentValue)) {
		const exists = currentValue.some((item) => String(item) === option);
		if (exists) {
			return currentValue.filter((item) => String(item) !== option) as T;
		}
		return [...currentValue, option as unknown as (typeof currentValue)[number]] as T;
	}

	if (typeof currentValue === 'string' && title === 'Sort') {
		return option as T;
	} else if (typeof currentValue === 'string') {
		return (currentValue === option ? '' : option) as T;
	}

	return currentValue;
};

const initialSearchFilters: SearchFilters = {
	sort: 'Relevance',
	title: [],
	year: [],
	make: '',
	selectedModels: [],
	model: [],
	trim: [],
	bodyStyle: [],
	runAndDrive: [],
	vin: [],
	lotInv: [],
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
	odometerDescription: [],
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
	SET_Models: (make: string, makes: makesType[]) => void;
	SET_SelectedModel: (value: string) => void;
}

export const setFilterResults_State = create<FilterResultsState>((set) => ({
	searchFilters: initialSearchFilters,
	SET_Filter: (filters: string, label: string) => {
		const labelCamelCase = _.camelCase(label);
		if (!isSearchFilterKey(labelCamelCase)) return;

		set((state) => {
			if (labelCamelCase === 'model') {
				return {
					searchFilters: {
						...state.searchFilters,
						selectedModels: selectToggle(filters, state.searchFilters.selectedModels, label),
					},
				};
			}

			return {
				searchFilters: {
					...state.searchFilters,
					[labelCamelCase]: selectToggle(filters, state.searchFilters[labelCamelCase], label),
				},
			};
		});
	},
	SET_Models: (make: string, makes: makesType[]) => {
		const models = getModels(make, makes);
		set((state) => ({
			searchFilters: {
				...state.searchFilters,
				model: models,
				selectedModels: [],
			},
		}));
	},
	SET_SelectedModel: (value: string) => {
		set((state) => {
			const exists = state.searchFilters.selectedModels.includes(value);

			return {
				searchFilters: {
					...state.searchFilters,
					selectedModels: exists ? state.searchFilters.selectedModels.filter((item) => item !== value) : [...state.searchFilters.selectedModels, value],
				},
			};
		});
	},
}));
