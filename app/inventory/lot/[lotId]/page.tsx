'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { LotDetails } from '@/lib/types/lotDetails-type';
import saleList from '@/app/results/saleList.json';
import LogButton from '@/app/components/common/buttons/logButton';

type OtomotoCheckResult = {
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

type OtomotoCheckRecord = {
	lotNumber: string;
	listed_otomoto: boolean;
	listing_count: number;
};

export default function LotDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const saleId = params.id as string;
	const lotId = params.lotId as string;
	const [car, setCar] = useState<LotDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [otomotoResult, setOtomotoResult] = useState<OtomotoCheckResult | null>(null);
	const [otomotoLoading, setOtomotoLoading] = useState(false);
	const otomotoCheckRef = useRef(false); // Prevent duplicate otomoto checks
	const [AiImage, setAiImage] = useState(false);

	useEffect(() => {
		const loadCarData = async () => {
			try {
				// // Load basic data from auctions.json using the saleId
				// const response = await fetch(`/api/auctions?auctionId=${saleId}`);
				// if (response.ok) {
				// 	const auctionData = await response.json();
				// 	if (auctionData && auctionData.cars) {
				// 		const foundCar = auctionData.cars.find((c: LotDetails) => String(c.lotNumber) === lotId);
				// 		if (foundCar) {
				// 			setCar(foundCar);
				// 			setSelectedImageIndex(0);
				// 		} else {
				// 			console.error('Lot not found in auction data');
				// 		}
				// 	}

				if (saleList && saleList.length > 0) {
					const foundCar = saleList.find((c: LotDetails) => String(c.lotNumber) === lotId);
					if (foundCar) {
						setCar(foundCar);
						setSelectedImageIndex(0);
					} else {
						console.error('Lot not found in sale list');
					}
				} else {
					console.error('Failed to load auction data');
				}
			} catch (error) {
				console.error('Error loading car data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadCarData();
	}, [lotId, saleId]);

	// Load Otomoto listing check result
	useEffect(() => {
		if (car && !otomotoCheckRef.current) {
			otomotoCheckRef.current = true;

			const loadOtomotoListingCheck = async () => {
				setOtomotoLoading(true);
				try {
					const response = await fetch('/api/otomoto-listing-check?action=load');
					if (response.ok) {
						const data = await response.json();
						const carCheck = data.results?.find((r: OtomotoCheckRecord) => r.lotNumber === car.lotNumber);
						if (carCheck) {
							const searchQuery = `${car.make} ${car.model}`.toLowerCase();
							setOtomotoResult({
								lotNumber: car.lotNumber,
								title: car.title,
								make: car.make,
								model: car.model,
								searchQuery: searchQuery,
								url: `https://www.otomoto.pl/osobowe/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`,
								found: carCheck.listed_otomoto,
								count: carCheck.listing_count,
							});
						} else {
							// If car not in check results, run verification automatically
							await runOtomotoVerification();
						}
					}
				} catch (error) {
					console.error('Error loading Otomoto listing check:', error);
				} finally {
					setOtomotoLoading(false);
				}
			};

			loadOtomotoListingCheck();
		}
	}, [car]);

	const handleBack = () => {
		router.push(`/inventory`);
	};

	const toggleAIimage = () => {
		setAiImage(!AiImage);
	};

	// Function to run Otomoto verification for this car
	const runOtomotoVerification = async () => {
		if (!car) return;
		setOtomotoLoading(true);
		try {
			// Send car details to API for verification
			const response = await fetch('/api/otomoto-listing-check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					make: car.make,
					model: car.model,
					lotNumber: car.lotNumber,
					year: car.year,
					odometer: car.odometer,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.result) {
					setOtomotoResult({
						lotNumber: car.lotNumber,
						title: car.title,
						make: car.make,
						model: car.model,
						searchQuery: `${car.make} ${car.model}`.toLowerCase(),
						url: `https://www.otomoto.pl/osobowe/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`,
						found: data.result.listed_otomoto,
						count: data.result.listing_count,
					});
				}
			} else {
				console.error('API error:', await response.text());
			}
		} catch (error) {
			console.error('Error running Otomoto verification:', error);
		} finally {
			setOtomotoLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading car details...</p>
				</div>
			</div>
		);
	}

	if (!car) {
		return (
			<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-7xl mx-auto'>
					<button
						onClick={() => {
							handleBack();
						}}
						className='text-blue-600 hover:text-blue-800 font-medium mb-4'>
						← Back to Sale List
					</button>
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>LotDetails not found</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<button onClick={() => handleBack()} className='text-var(--header-text) hover:text-[var(--mongo-green)] font-medium mb-5'>
					← Back to Sale List
				</button>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column - Main Info */}
					<div className='lg:col-span-2'>
						{/* Images */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							{/* Main Image with Navigation */}
							<div className='mb-4'>
								{car.images && car.images.length > 0 ? (
									<>
										<div className='flex flex-row justify-between'>
											<div className='w-45 mb-4'>
												{!AiImage ? (
													<LogButton
														onclick={() => setAiImage(!AiImage)}
														item={{
															href: '',
															label: 'Orginal Image',
															fontSize: undefined,
															class: 'image-orginal-button',
														}}></LogButton>
												) : (
													<LogButton
														onclick={() => setAiImage(!AiImage)}
														item={{
															href: '',
															label: 'AI Visualisation',
															fontSize: undefined,
															class: 'image-ai-button',
														}}></LogButton>
												)}
											</div>
											<div className='w-45 mb-4'></div>
										</div>
										<div
											className={`relative w-full h-[400px] bg-gray-200 rounded overflow-hidden mb-4 group  border-4 ${AiImage ? 'border-[var(--color-green-600)] ' : 'border-white'}`}>
											<img
												src={car.images[selectedImageIndex]}
												className='w-full h-full object-contain'
												onError={(e) => {
													e.currentTarget.src = '/images/placeholder.png';
												}}
											/>
											{car.images.length > 1 && (
												<>
													<button
														onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : car.images!.length - 1))}
														className='absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100'>
														←
													</button>
													<button
														onClick={() => setSelectedImageIndex((prev) => (prev < car.images!.length - 1 ? prev + 1 : 0))}
														className='absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100'>
														→
													</button>
												</>
											)}
										</div>
										<div>
											<div className='grid grid-cols-6 gap-2'>
												{car.images.map((imgUrl, idx) => (
													<button
														key={idx}
														onClick={() => setSelectedImageIndex(idx)}
														title={`Image ${idx + 1}`}
														className={`relative aspect-square rounded overflow-hidden border-2 transition-all hover:scale-105 ${
															selectedImageIndex === idx
																? 'border-blue-600 ring-2 ring-blue-400 ring-offset-1'
																: 'border-gray-300 hover:border-blue-400'
														}`}>
														<img
															src={imgUrl}
															alt={`Thumbnail ${idx + 1}`}
															className='w-full h-full object-cover'
															onError={(e) => {
																e.currentTarget.src = '/images/placeholder.png';
															}}
														/>
													</button>
												))}
											</div>
										</div>
									</>
								) : car.images[0] ? (
									<div className='relative w-full h-[400px] bg-gray-200 rounded overflow-hidden'>
										<img
											src={car.images[0]}
											alt={car.title}
											className='w-full h-full object-contain'
											onError={(e) => {
												e.currentTarget.src = '/images/placeholder.png';
											}}
										/>
										<div className='absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-medium'>1 / 1</div>
									</div>
								) : (
									<div className='w-full h-[400px] bg-gray-100 rounded flex items-center justify-center border-2 border-gray-200'>
										<div className='text-center'>
											<p className='text-gray-400 text-lg'>No Images Available</p>
											<p className='text-gray-500 text-sm mt-2'>Check Copart for vehicle images</p>
										</div>
									</div>
								)}
							</div>

							{car.copartLink && (
								<a href={car.copartLink} target='_blank' rel='noopener noreferrer' className='inline-block text-blue-600 hover:text-blue-800 font-medium mb-6'>
									📷 View Full Gallery on Copart →
								</a>
							)}
						</div>

						{/* Vehicle Details */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<h2 className='text-xl font-bold text-gray-900 mb-4'>Vehicle Details</h2>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-gray-600'>Year</p>
									<p className='font-medium text-gray-900'>{car.year || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Make</p>
									<p className='font-medium text-gray-900'>{car.make || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Model</p>
									<p className='font-medium text-gray-900'>{car.model || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Body Type</p>
									<p className='font-medium text-gray-900'>{car.bodyStyle || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Color</p>
									<p className='font-medium text-gray-900'>{car.color || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Transmission</p>
									<p className='font-medium text-gray-900'>{car.transmission || 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Odometer</p>
									<p className='font-medium text-gray-900'>{car.odometer ? `${car.odometer} mi` : 'N/A'}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Title Code</p>
									<p className='font-medium text-gray-900'>{car.titleCode || 'N/A'}</p>
								</div>
								<div className='col-span-2'>
									<p className='text-sm text-gray-600'>Primary Damage</p>
									<span
										className={`inline-block px-3 py-1 rounded text-sm font-medium ${
											car.primaryDamage === 'Clean Title'
												? 'bg-green-100 text-green-800'
												: car.primaryDamage?.includes('Water') || car.primaryDamage?.includes('Fire')
													? 'bg-red-100 text-red-800'
													: 'bg-yellow-100 text-yellow-800'
										}`}>
										{car.primaryDamage || 'N/A'}
									</span>
								</div>
								{car.vin && (
									<div className='col-span-2'>
										<p className='text-sm text-gray-600'>VIN</p>
										<p className='font-medium text-gray-900 font-mono'>{car.vin}</p>
									</div>
								)}
							</div>
						</div>

						{/* Vehicle Condition Report */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<h2 className='text-xl font-bold text-gray-900 mb-4'>Vehicle Condition</h2>
							<div className='grid grid-cols-2 gap-4'>
								<div className='flex items-center gap-2'>
									<span className={`w-3 h-3 rounded-full ${car.runAndDrive ? 'bg-green-500' : 'bg-red-500'}`}></span>
									<div>
										<p className='text-sm text-gray-600'>Engine Starts</p>
										<p className='font-medium text-gray-900'>{car.engineStatus || (car.runAndDrive ? 'Yes' : 'No')}</p>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<span className={`w-3 h-3 rounded-full ${car.transmissionEngages ? 'bg-green-500' : 'bg-red-500'}`}></span>
									<div>
										<p className='text-sm text-gray-600'>Transmission Engages</p>
										<p className='font-medium text-gray-900'>{car.transmissionEngages ? 'Yes' : 'No'}</p>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<span className={`w-3 h-3 rounded-full ${car.hasKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
									<div>
										<p className='text-sm text-gray-600'>Keys Available</p>
										<p className='font-medium text-gray-900'>{car.hasKey ? 'Yes' : 'No'}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Highlights */}
						{car.highlights && car.highlights.length > 0 && (
							<div className='bg-white rounded-lg shadow p-6 mb-6'>
								<h2 className='text-xl font-bold text-gray-900 mb-4'>Highlights</h2>
								<div className='flex flex-wrap gap-2'>
									{car.highlights.map((highlight, index) => (
										<span key={index} className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
											{highlight}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Right Column - Bidding Info */}
					<div>
						{/* Price Information */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<div className='space-y-4'>
								<div>
									<h3 className='font-semibold text-gray-600 text-sm mb-1'>Current Bid</h3>
									<p className='text-3xl font-bold text-blue-600'>{car.currentBid ? `$${car.currentBid.toLocaleString()}` : 'N/A'}</p>
								</div>
								{car.buyItNow !== null && (
									<div className='pt-4 border-t border-gray-200'>
										<h3 className='font-semibold text-gray-600 text-sm mb-1'>Buy It Now Price</h3>
										<p className='text-3xl font-bold text-green-600'>${car.buyItNow.toLocaleString()}</p>
										<p className='text-xs text-gray-500 mt-2'>End the auction immediately at this price</p>
									</div>
								)}
							</div>
						</div>

						{/* Action Buttons */}
						<div className='space-y-3 mb-6'>
							<button className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition'>Place Bid</button>
							<button className='w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition'>Buy It Now</button>
							<button className='w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition'>Add to Watchlist</button>
						</div>

						{/* Otomoto Check */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='font-bold text-gray-900 flex items-center gap-2'>
									<span>🚗</span> Otomoto Check
								</h3>
								<button
									onClick={runOtomotoVerification}
									disabled={otomotoLoading}
									className='px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition'>
									{otomotoLoading ? 'Checking...' : 'Check Now'}
								</button>
							</div>
							{otomotoLoading ? (
								<div className='text-center py-4'>
									<div className='flex items-center justify-center gap-2 mb-2'>
										<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
										<span className='text-gray-600'>Checking Otomoto...</span>
									</div>
									<p className='text-xs text-gray-500'>This may take a moment</p>
								</div>
							) : otomotoResult ? (
								<div className='space-y-3'>
									{otomotoResult.found ? (
										<div className='bg-green-50 border border-green-300 rounded p-3'>
											<div className='flex items-center gap-2'>
												<span className='text-xl'>✓</span>
												<div>
													<p className='font-semibold text-green-900'>Found on Otomoto!</p>
													<p className='text-sm text-green-700'>
														{otomotoResult.count} listing{otomotoResult.count !== 1 ? 's' : ''} found
													</p>
													<a
														href={otomotoResult.url}
														target='_blank'
														rel='noopener noreferrer'
														className='text-sm text-green-600 hover:text-green-800 mt-2 inline-block'>
														View on Otomoto →
													</a>
												</div>
											</div>
										</div>
									) : (
										<div className='bg-red-50 border border-red-300 rounded p-3'>
											<div className='flex items-center gap-2'>
												<span className='text-xl'>✗</span>
												<div>
													<p className='font-semibold text-red-900'>Not found on Otomoto</p>
													<p className='text-sm text-red-700'>No listings match this make/model</p>
												</div>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className='text-center py-3'>
									<p className='text-gray-600 text-sm'>Click &quot;Check Now&quot; to verify on Otomoto</p>
								</div>
							)}
						</div>

						{/* Disclaimer */}
						<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
							<p className='text-sm text-yellow-800'>
								<strong>Note:</strong> All bids are legally binding and all sales are final. Please review all vehicle information before bidding.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
