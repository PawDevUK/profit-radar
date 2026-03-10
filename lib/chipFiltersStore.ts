import { create } from 'zustand';

interface ChipFiltersState {
	selectedFilters: string[];
}

interface ChipFiltersActions {
	toggleFilter: (filter: string) => void;
}

type ChipFiltersStore = ChipFiltersState & ChipFiltersActions;

export const chipFiltersStore = create<ChipFiltersStore>((set) => ({
	selectedFilters: [],
	toggleFilter: (filter: string) =>
		set((state) => ({
			selectedFilters: state.selectedFilters.includes(filter) ? state.selectedFilters.filter((f) => f !== filter) : [...state.selectedFilters, filter],
		})),
}));
