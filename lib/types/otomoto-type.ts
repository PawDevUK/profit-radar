export type OtomotoCheckResult = {
	lotNumber: string;
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
	lotNumber: string;
	listed_otomoto: boolean;
	listing_count: number;
};
