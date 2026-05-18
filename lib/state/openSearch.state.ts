import { create } from 'zustand';

interface openSearchTypes {
	isSearchOpen: boolean;
	toggleSearchOpen: () => void;
}

const useOpenSearchStore = create<openSearchTypes>((set, get) => ({
	isSearchOpen: false,
	toggleSearchOpen: () => {
		set((state) => ({ isSearchOpen: !state.isSearchOpen }));
		console.log('State has changed', get().isSearchOpen);
	},
}));

export const useOpenSearch = () => useOpenSearchStore((state) => state.isSearchOpen);
export const useSetOpenSearch = () => useOpenSearchStore((state) => state.toggleSearchOpen);
