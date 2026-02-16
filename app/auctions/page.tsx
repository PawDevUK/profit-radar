import { headers } from 'next/headers';
import { AuctionData } from './AuctionsClient';

// Helper to resolve base URL for server-side fetch
// async function resolveBaseUrl() {
// 	const h = await headers();
// 	const host = h.get('host');
// 	const protocol = h.get('x-forwarded-proto') || 'http';
// 	const envBase = process.env.NEXT_PUBLIC_BASE_URL;
// 	if (envBase) return envBase.replace(/\/$/, '');
// 	if (host) return `${protocol}://${host}`;
// 	return 'http://localhost:3000';
// }

// export const dynamic = 'force-static';

// export default async function AuctionsPage() {
// 	// const baseUrl = await resolveBaseUrl();
// 	const res = await fetch('/api/auctions', {
// 		next: { revalidate: 60, tags: ['auctions'] },
// 	});
// 	if (!res.ok) {
// 		throw new Error('Failed to load auctions');
// 	}
// 	const data = await res.json();

// 	// Replace 'AuctionData' with the correct type if needed
// 	const initialEntries: Array<[string, AuctionData]> = Object.entries(data || {}) as Array<[string, AuctionData]>;

// 	// Lazy import client component to keep this as a Server Component entry
// 	const AuctionsClient = (await import('./AuctionsClient')).AuctionsClient;

// 	return (
// 		<section className='p-6 space-y-4'>
// 			<h1 className='text-2xl font-semibold'>Auctions</h1>
// 			<p className='text-sm text-gray-500'>Server-fetched with revalidate=60 and tag=&quot;auctions&quot;</p>
// 			<AuctionsClient initialData={initialEntries} />
// 		</section>
// 	);
// }
