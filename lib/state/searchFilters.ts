import { create } from 'zustand';

type SortState = {
	selectedSortFilters: string;
	setSortFilters: (filters: string) => void;
};

type MultiSelectState = {
	selectedMultiSelectFilters: string[];
	setMultiSelectFilters: (filters: string[]) => void;
};

type SelectOneState = {
	selectedOneFilter: {
		[label: string]: string;
	};
	setSelectOneFilter: (filters: string, label: string) => void;
};

export const sortState = create<SortState>((set) => ({
	selectedSortFilters: '',
	setSortFilters: (filters: string) => set({ selectedSortFilters: filters }),
}));

export const multiSelect_State = create<MultiSelectState>((set) => ({
	selectedMultiSelectFilters: [],
	setMultiSelectFilters: (filters: string[]) => set({ selectedMultiSelectFilters: filters }),
}));

export const selectOne_State = create<SelectOneState>((set) => ({
	selectedOneFilter: {
		label: '',
		selected: '',
	},
	setSelectOneFilter: (filters: string, label: string) =>
		set({
			selectedOneFilter: {
				label,
				selected: filters,
			},
		}),
}));
