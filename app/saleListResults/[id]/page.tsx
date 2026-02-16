'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { LotDetails } from '@/lib/types/lot-details';
import Image from 'next/image';

export default function SaleListResultsPage() {
	const params = useParams();
	const router = useRouter();
	const saleId = params.id as string;
	const [cars, setCars] = useState<LotDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saleName, setSaleName] = useState<string | null>(null);
	const [saleMeta, setSaleMeta] = useState<{ location?: string; saleDate?: string; saleTime?: string } | null>(null);
	const fetchingRef = useRef(false); // Prevent duplicate fetching

	useEffect(() => {
		// Prevent duplicate execution
		if (fetchingRef.current) return;
		fetchingRef.current = true;

		const loadOrScrapeData = async () => {
			try {
				// Get the full URL and sale metadata from sessionStorage
				const auctionUrl = sessionStorage.getItem(`auction_${saleId}_url`);
				const location = sessionStorage.getItem(`auction_${saleId}_location`) || saleId;
				const storedSaleDate = sessionStorage.getItem(`auction_${saleId}_saleDate`) || '';
				const storedSaleTime = sessionStorage.getItem(`auction_${saleId}_saleTime`) || '';
				const storedSaleName = sessionStorage.getItem(`auction_${saleId}_name`);

				// Set header display values
				setSaleName(storedSaleName || null);
				setSaleMeta({ location, saleDate: storedSaleDate || undefined, saleTime: storedSaleTime || undefined });

				if (!auctionUrl) {
					setError('Missing auction URL. Please navigate from the calendar page.');
					setLoading(false);
					return;
				}

				console.log('Using auction URL:', auctionUrl);

				// Check if auction exists in consolidated auctions.json
				const auctionResponse = await fetch(`/api/auctions?auctionId=${saleId}`);

				if (auctionResponse.ok) {
					const auctionData = await auctionResponse.json();
					if (auctionData && auctionData.cars && auctionData.cars.length > 0) {
						console.log(`Loaded ${auctionData.cars.length} cars from auctions.json`);
						setCars(auctionData.cars);
						setLoading(false);
						return;
					} else if (auctionData && auctionData.cars && auctionData.cars.length === 0) {
						console.log('Auction exists but cars array is empty, fetching data...');
					}
				} else {
					console.log('Auction not found in auctions.json, fetching data...');
				}

				// Auction doesn't exist or has empty cars array, fetch data
				console.log('Auction URL:', auctionUrl);
				console.log('Location:', location);
				setFetching(true);
				setLoading(false);

				// Fetch auction data from the API
				const fetchResponse = await fetch('/api/scrape-sale-list', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						auctionUrl,
						auctionId: saleId,
						location,
					}),
				});

				if (!fetchResponse.ok) {
					const errorData = await fetchResponse.json();
					throw new Error(errorData.details || 'Failed to fetch auction data');
				}

				// const fetchResult = await fetchResponse.json();
				// console.log('Data fetch complete:', fetchResult);

				// Load the newly fetched data from auctions.json
				const updatedAuctionResponse = await fetch(`/api/auctions?auctionId=${saleId}`);
				if (updatedAuctionResponse.ok) {
					const auctionData = await updatedAuctionResponse.json();
					if (auctionData && auctionData.cars) {
						if (auctionData.cars.length === 0) {
							setError('No cars found in this auction. The auction may be empty or not available at this time. Please try refreshing the page.');
						} else {
							setCars(auctionData.cars);
						}
					}
				} else {
					setError('Failed to load data after fetching completed');
				}

				setFetching(false);
			} catch (error) {
				console.error('Error loading/fetching data:', error);
				setError(error instanceof Error ? error.message : 'Unknown error');
				setLoading(false);
				setFetching(false);
			}
		};

		loadOrScrapeData();
	}, [saleId]);

	const handleRowClick = (lotNumber: string | number) => {
		router.push(`/saleListResults/${saleId}/lot/${lotNumber}`);
	};

	if (loading || fetching) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>{fetching ? 'Fetching auction data...' : 'Loading cars...'}</p>
					{fetching && <p className='text-sm text-gray-500 mt-2'>This may take up to 2 minutes</p>}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center max-w-lg'>
					<div className='text-red-600 text-xl mb-4'>⚠️ Error</div>
					<p className='text-gray-700 mb-4'>{error}</p>
					<div className='flex gap-4 justify-center'>
						<button onClick={() => router.back()} className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700'>
							Go Back
						</button>
						<button onClick={() => window.location.reload()} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
							Try Again
						</button>
					</div>
					<p className='text-sm text-gray-500 mt-4'>Note: If a verification window appears, please complete it to continue.</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-[1400px] mx-auto'>
				<div className='mb-6'>
					<button onClick={() => router.back()} className='text-blue-600 hover:text-blue-800 font-medium mb-4'>
						← Back to Sales
					</button>
					<h1 className='text-3xl font-bold text-gray-900 mb-1'>Sale List Results</h1>
					{saleName ? (
						<p className='text-gray-700 text-sm mb-1'>{saleName}</p>
					) : (
						<p className='text-gray-700 text-sm mb-1'>
							{saleMeta?.location || 'Unknown location'}
							{saleMeta?.saleDate ? ` — ${saleMeta.saleDate}` : ''}
							{saleMeta?.saleTime ? ` ${saleMeta.saleTime}` : ''}
						</p>
					)}
					<p className='text-gray-600'>Showing {cars.length} cars for sale</p>
				</div>

				<div className='bg-white rounded-lg shadow overflow-hidden'>
					{/* Header */}
					<div className='grid grid-cols-[200px_120px_1fr_140px_120px_110px_110px] gap-4 px-4 py-3 bg-gray-100 border-b-2 border-gray-300 font-semibold text-gray-900 text-sm'>
						<div>IMAGE</div>
						<div>LOT #</div>
						<div>VEHICLE INFO</div>
						<div>DAMAGE</div>
						<div>ODOMETER</div>
						<div>CURRENT BID</div>
						<div>BUY IT NOW</div>
					</div>

					{/* Rows */}
					<div className='divide-y divide-gray-200'>
						{cars.map((car, index) => (
							<div
								key={index}
								onClick={() => handleRowClick(car.lotNumber)}
								className='grid grid-cols-[200px_120px_1fr_140px_120px_110px_110px] gap-4 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer items-center h-[145px]'>
								{/* Image */}
								<div className='relative w-[180px] h-[125px] bg-gray-200 rounded overflow-hidden'>
									{car.images.length > 0 ? (
										<Image src={car.images[0]} alt={car.title} fill className='object-cover' sizes='(max-width: 600px) 100vw, 180px' priority={index < 10} />
									) : (
										<div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>No Image</div>
									)}
								</div>

								{/* Lot Number */}
								<div className='text-sm'>
									<div className='font-semibold text-blue-600'>{car.lotNumber}</div>
								</div>

								{/* Vehicle Info */}
								<div className='text-sm space-y-1'>
									<div className='font-semibold text-gray-900'>{car.title || `${car.year} ${car.make} ${car.model}`.trim()}</div>
									{car.vin && <div className='text-gray-500 text-xs'>VIN: {car.vin}</div>}
								</div>

								{/* Damage */}
								<div className='text-sm'>
									<span
										className={`inline-block px-2 py-1 rounded text-xs font-medium ${
											car.primaryDamage === 'Clean Title'
												? 'bg-green-100 text-green-800'
												: car.primaryDamage?.includes('Water') || car.primaryDamage?.includes('Fire')
													? 'bg-red-100 text-red-800'
													: 'bg-yellow-100 text-yellow-800'
										}`}>
										{car.primaryDamage || 'N/A'}
									</span>
								</div>

								{/* Odometer */}
								<div className='text-sm text-gray-700'>{car.odometer ? `${car.odometer} mi` : 'N/A'}</div>

								{/* Current Bid */}
								<div className='text-sm font-bold text-gray-900'>{car.currentBid || 'N/A'}</div>

								{/* Buy It Now Price */}
								<div className='text-sm font-bold'>
									{car.buyItNow ? <span className='text-green-600'>{car.buyItNow}</span> : <span className='text-gray-400'>—</span>}
								</div>
							</div>
						))}
					</div>
				</div>

				{cars.length === 0 && (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>No cars found for this sale</p>
					</div>
				)}
			</div>
		</div>
	);
}
