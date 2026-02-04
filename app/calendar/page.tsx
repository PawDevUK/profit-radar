'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Sale = {
	location: string;
	saleDate: string;
	saleTime: string;
	viewSalesLink: string;
	numberOnSale?: number;
};

export default function CalendarPage() {
	const router = useRouter();
	const [sales, setSales] = useState<Sale[]>([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadAuctions = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch('/api/auctions');
			const auctionsData = await response.json();

			if (auctionsData.auctionsList && Array.isArray(auctionsData.auctionsList)) {
				// Filter out invalid entries
				let validAuctions = auctionsData.auctionsList.filter((auction: Sale) => {
					return auction.saleTime && !auction.saleTime.includes('Auctions already ended') && !auction.saleTime.includes('*NCS') && auction.saleTime.length < 15;
				});

				// Enhance with actual lot counts from scraped auction data if available
				validAuctions = validAuctions.map((auction: Sale) => {
					// Try to find matching auction data by location and date
					for (const [key, auctionData] of Object.entries(auctionsData)) {
						if (key !== 'auctionsList' && key !== 'auctionsListScrapedAt' && typeof auctionData === 'object' && auctionData !== null) {
							const data = auctionData as any;
							if (data.location === auction.location && data.cars && Array.isArray(data.cars) && data.cars.length > 0) {
								return {
									...auction,
									numberOnSale: data.cars.length,
								};
							}
						}
					}
					return auction;
				});

				setSales(validAuctions);
			} else {
				setSales([]);
				setError('No auctions found');
			}
		} catch (err) {
			console.error('Error loading auctions:', err);
			setError('Failed to load auctions');
			setSales([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadAuctions();
	}, []);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			const response = await fetch('/api/scrape-calendar', {
				method: 'POST',
			});
			const data = await response.json();

			if (data.success) {
				// Reload auctions from the API
				await loadAuctions();
				alert('Calendar refreshed successfully!');
			} else {
				alert(`Failed to refresh calendar: ${data.message}`);
			}
		} catch (error) {
			console.error('Error refreshing calendar:', error);
			alert('Failed to refresh calendar. Please try again.');
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleRowClick = (sale: Sale) => {
		// Extract yard number from the viewSalesLink
		const yardNumMatch = sale.viewSalesLink.match(/yardNum=(\d+)/);
		const yardNum = yardNumMatch ? yardNumMatch[1] : '';

		// Create a unique ID from yardNum and date
		const auctionId = `${yardNum}_${sale.saleDate.replace(/-/g, '')}`;

		// Store the full auction URL and location in sessionStorage for the scraper to use
		sessionStorage.setItem(`auction_${auctionId}_url`, sale.viewSalesLink);
		sessionStorage.setItem(`auction_${auctionId}_location`, sale.location);
		// Also store sale date/time and a human-friendly sale name for display
		sessionStorage.setItem(`auction_${auctionId}_saleDate`, sale.saleDate);
		sessionStorage.setItem(`auction_${auctionId}_saleTime`, sale.saleTime);
		const saleName = `${sale.location} — ${sale.saleDate}${sale.saleTime ? ` ${sale.saleTime}` : ''}`;
		sessionStorage.setItem(`auction_${auctionId}_name`, saleName);

		// Navigate to the sale list results page
		router.push(`/saleListResults/${auctionId}`);
	};

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className=' mb-2'>
					<h1 className='text-2xl font-bold text-gray-900 mb-1'>Copart Auction Calendar</h1>
					<p className='text-xsm text-gray-600'>{loading ? 'Loading...' : `${sales.length} auctions available`}</p>
				</div>
				<div className='mt-6 mb-4'>
					<button
						onClick={handleRefresh}
						disabled={isRefreshing}
						className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2'>
						{isRefreshing ? (
							<>
								<svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
								</svg>
								Refreshing...
							</>
						) : (
							<>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
									<path
										fillRule='evenodd'
										d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
										clipRule='evenodd'
									/>
								</svg>
								Refresh Calendar
							</>
						)}
					</button>
				</div>
				<div className='mt-6'>
					{loading ? (
						<div className='bg-white rounded-lg shadow p-8 text-center'>
							<div className='flex justify-center items-center'>
								<svg className='animate-spin h-8 w-8 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
								</svg>
								<span className='ml-3 text-gray-600'>Loading auctions...</span>
							</div>
						</div>
					) : error || sales.length === 0 ? (
						<div className='bg-white rounded-lg shadow p-8 text-center'>
							<svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
							<h3 className='mt-2 text-lg font-medium text-gray-900'>No auctions found</h3>
							<p className='mt-1 text-sm text-gray-500'>Click the "Refresh Calendar" button to load the latest auctions.</p>
						</div>
					) : (
						<div className='overflow-x-auto bg-white rounded-lg shadow'>
							<table className='w-full border-collapse'>
								<thead>
									<tr className='bg-gray-100 border-b-2 border-gray-300'>
										<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
											Location
										</th>
										<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
											Sale Date
										</th>
										<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
											Sale Time
										</th>
										<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
											Lots
										</th>
										<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{sales.map((sale, index) => (
										<tr
											key={index}
											className='border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer'
											onClick={() => handleRowClick(sale)}>
											<td className='px-6 py-4 text-gray-900 font-medium'>{sale.location}</td>
											<td className='px-6 py-4 text-gray-700'>{sale.saleDate}</td>
											<td className='px-6 py-4 text-gray-700'>{sale.saleTime}</td>
											<td className='px-6 py-4 text-gray-700'>
												{typeof sale.numberOnSale === 'number' ? (
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
														{sale.numberOnSale}
													</span>
												) : (
													<span className='text-gray-400'>—</span>
												)}
											</td>
											<td className='px-6 py-4'>
												<span className='text-blue-600 hover:text-blue-800 font-medium hover:underline'>View Listings →</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
