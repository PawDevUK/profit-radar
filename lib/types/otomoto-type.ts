export type OtomotoCheckResult = {
	lotInv: string;
	title: string;
	make: string;
	model: string;
	searchQuery: string;
	url: string;
	found?: boolean;
	count?: number;
	error?: string;
};

export type OtomotoCheckRecord = {
	lotInv: string;
	listed_otomoto: boolean;
	listing_count: number;
};
