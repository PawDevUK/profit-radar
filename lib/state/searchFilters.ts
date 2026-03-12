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
	selectedOneFilter: { Sort: { label: string; selected: string }; Make: { label: string; selected: string } };
	SETselectOneFilter: (filters: string, label: string) => void;
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
	selectedOneFilter: { Sort: { label: '', selected: '' }, Make: { label: '', selected: '' } },
	SETselectOneFilter: (filters: string, label: string) =>
		set((state) => ({
			selectedOneFilter: {
				...state.selectedOneFilter,
				[label]: {
					label: label,
					selected: filters,
				},
			},
		})),
}));
