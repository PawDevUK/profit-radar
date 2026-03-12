import { create } from 'zustand';

type SortState = {
	selectedSortFilters: string;
	setSortFilters: (filters: string) => void;
};

type MultiSelectState = {
	selectedMultiSelectFilters: string[];
	setMultiSelectFilters: (filters: string[]) => void;
};

export const sortState = create<SortState>((set) => ({
	selectedSortFilters: '',
	setSortFilters: (filters: string) => set({ selectedSortFilters: filters }),
}));

export const multiSelect_State = create<MultiSelectState>((set) => ({
	selectedMultiSelectFilters: [],
	setMultiSelectFilters: (filters: string[]) => set({ selectedMultiSelectFilters: filters }),
}));

type SelectOneState = {
	selectedOneFilter: { sort: string; make: string };
	SETselectOneFilter: (filters: string, label: string) => void;
};

export const selectOne_State = create<SelectOneState>((set) => ({
	selectedOneFilter: { sort: '', make: '' },
	SETselectOneFilter: (filters: string, label: string) => {
		const Label = label.toLocaleLowerCase();
		set((state) => ({
			selectedOneFilter: {
				...state.selectedOneFilter,
				[Label]: filters,
			},
		}));
	},
}));
