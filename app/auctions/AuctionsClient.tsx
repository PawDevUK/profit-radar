'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export interface AuctionData {
	title?: string;
	note?: string;
	scrapedAt?: string;
	[key: string]: unknown;
}

export function AuctionsClient({ initialData }: { initialData: Array<[string, AuctionData]> }) {
	const { data, isLoading, error, mutate } = useSWR('/api/auctions', fetcher, {
		fallbackData: Object.fromEntries(initialData || []),
		dedupingInterval: 10000,
		revalidateOnFocus: true,
	});

	const [creating, setCreating] = useState(false);

	async function addDemoAuction() {
		setCreating(true);
		try {
			const demoId = `demo-${Date.now()}`;
			const payload = {
				auctionId: demoId,
				data: { title: 'Demo Auction', note: 'Created from UI', scrapedAt: new Date().toISOString() },
			};
			const res = await fetch('/api/auctions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error('Failed to create');
			// Locally update cache for snappy UX; server tag revalidation also occurs in the route
			await mutate();
		} catch (e) {
			console.error(e);
		} finally {
			setCreating(false);
		}
	}

	const entries: Array<[string, AuctionData]> = Object.entries(data || {});

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-2'>
				<button onClick={addDemoAuction} disabled={creating} className='px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'>
					{creating ? 'Adding…' : 'Add Demo Auction'}
				</button>
			</div>
			{error && <div className='text-red-600'>Failed to load</div>}
			{isLoading && entries.length === 0 && <div>Loading…</div>}
			<ul className='space-y-2'>
				{entries.length === 0 && <li className='text-gray-500'>No auctions yet</li>}
				{entries.map(([id, a]) => (
					<li key={id} className='border rounded p-3'>
						<div className='font-medium'>{a?.title || id}</div>
						{a?.scrapedAt && <div className='text-xs text-gray-500'>Updated: {a.scrapedAt}</div>}
					</li>
				))}
			</ul>
		</div>
	);
}
