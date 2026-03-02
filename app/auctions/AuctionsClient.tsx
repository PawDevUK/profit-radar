'use client';
import { useState } from 'react';

export interface AuctionData {
	title?: string;
	note?: string;
	scrapedAt?: string;
	[key: string]: unknown;
}

export default function AuctionsClient({ initialData }: { initialData: AuctionData[] }) {
	const [entries, setEntries] = useState(Object.entries(initialData));
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	return (
		<div className='space-y-4'>
			{error && <div className='text-red-600'>Failed to load</div>}
			{isLoading && entries.length === 0 && <div>Loading…</div>}
			<ul className='space-y-2'>
				{entries.length === 0 && <li className='text-gray-500'>No auctions yet</li>}
				{entries.map(([id, a]) => (
					<li key={id} className='border rounded p-3'>
						{/* <div>{a.location}</div> */}
					</li>
				))}
			</ul>
		</div>
	);
}
