import { create } from 'zustand';

interface ChipFiltersState {
	selectedFilters: string[];
	toggleFilter: (filter: string) => void;
}

export const chipFilters_State = create<ChipFiltersState>((set) => ({
	selectedFilters: [],
	toggleFilter: (filter: string) =>
		set((state) => ({
			selectedFilters: state.selectedFilters.includes(filter) ? state.selectedFilters.filter((f) => f !== filter) : [...state.selectedFilters, filter],
		})),
}));
