import { LotDetailsType, createLotObject } from '@/lib/types/lotDetails-type';
import { create } from 'zustand';
type SelectedSingleLot = {
	selectedLot: LotDetailsType;
	setSelectedLot: (lot: LotDetailsType) => void;
	reset: () => void;
};

export const SelectSingleLot = create<SelectedSingleLot>((set, get) => ({
	selectedLot: createLotObject(),
	setSelectedLot: async (lot) => {
		if (lot) {
			set({
				selectedLot: { ...lot },
			});
		}
	},
	reset: () => {
		set({ selectedLot: createLotObject() });
	},
}));
