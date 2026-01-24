export type DashboardMetrics = {
	carsAtAuction: number;
	buyNowThisMonth: number;
	platformsSupported: number;
	platformsActive: number;
	platformsInactive: number;
	invoicesDownloaded: number;
	invoicesDue: number;
	invoicesPaid: number;
	totalPaidAmount: number;
	totalDueAmount: number;
};

// Temporary mock metrics. Replace with real data sources later.
const mockMetrics: DashboardMetrics = {
	carsAtAuction: 1280,
	buyNowThisMonth: 86,
	platformsSupported: 3,
	platformsActive: 2,
	platformsInactive: 1,
	invoicesDownloaded: 3,
	invoicesDue: 1,
	invoicesPaid: 2,
	totalPaidAmount: 1990,
	totalDueAmount: 980,
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
	return mockMetrics;
}
