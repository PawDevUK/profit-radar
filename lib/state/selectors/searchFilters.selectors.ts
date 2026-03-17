import { SearchFilters } from '@/lib/types/searchFilters-type';

type SearchFiltersStore = {
	searchFilters: SearchFilters;
	SET_Filter: (filters: string, label: string) => void;
};

export const selectSearchFilters = (s: SearchFiltersStore) => s.searchFilters;
export const selectSetFilter = (s: SearchFiltersStore) => s.SET_Filter;
export const selectSearchFilterByKey =
	<K extends keyof SearchFilters>(key: K) =>
	(s: SearchFiltersStore): SearchFilters[K] =>
		s.searchFilters[key];
