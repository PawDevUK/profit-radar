export type Platform = {
	_id: string;
	name: string;
	username?: string;
	isActive?: boolean;
	last_sync?: string;
};

export type Invoice = {
	_id: string;
	platform_id: string;
	document_id: string;
	filename: string;
	downloaded_at: string;
	status?: 'paid' | 'due';
	amount?: number;
};

export type PlatformWithInvoices = {
	platform: Platform;
	invoices: Invoice[];
	totalInvoices: number;
};

// TODO: Replace with real data source (DB or API) when available.
const mockPlatforms: Platform[] = [
	{ _id: 'copart', name: 'Copart', username: 'copart-demo', isActive: true, last_sync: '2026-01-19T10:30:00Z' },
	{ _id: 'iaai', name: 'IAAI', username: 'iaai-demo', isActive: true, last_sync: '2026-01-18T16:10:00Z' },
	{ _id: 'manheim', name: 'Manheim', username: 'manheim-demo', isActive: false, last_sync: '' },
];

const mockInvoices: Invoice[] = [
	{
		_id: 'inv-001',
		platform_id: 'copart',
		document_id: 'CPT-2026-001',
		filename: 'copart-invoice-001.pdf',
		downloaded_at: '2026-01-19T11:00:00Z',
		status: 'paid',
		amount: 1250,
	},
	{
		_id: 'inv-002',
		platform_id: 'copart',
		document_id: 'CPT-2026-002',
		filename: 'copart-invoice-002.pdf',
		downloaded_at: '2026-01-19T12:30:00Z',
		status: 'due',
		amount: 980,
	},
	{
		_id: 'inv-003',
		platform_id: 'iaai',
		document_id: 'IAAI-2026-001',
		filename: 'iaai-invoice-001.pdf',
		downloaded_at: '2026-01-18T17:05:00Z',
		status: 'paid',
		amount: 740,
	},
];

export async function getAllPlatforms(): Promise<Platform[]> {
	// In a real implementation, fetch from database or external API
	return mockPlatforms;
}

export async function getPlatformWithInvoices(id: string): Promise<PlatformWithInvoices | null> {
	const platform = mockPlatforms.find((p) => p._id === id);
	if (!platform) return null;

	const invoices = mockInvoices.filter((inv) => inv.platform_id === id);

	return {
		platform,
		invoices,
		totalInvoices: invoices.length,
	};
}
