'use client';

import scrapedSaleList from '@/lib/scrapers/copart/saleList/scrapedSaleList.json' with { type: 'json' };
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { scrapedDataType, LotDetails } from '@/lib/types/lotDetails-type';
import saleList from '@/app/results/saleList.json';
import LogButton from '@/app/components/common/buttons/logButton';
import LotDetailsSection from '@/app/inventory/lot/lotDetails';
import BidBuy from '../BidBuy';

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

				if (scrapedSaleList && scrapedSaleList.length > 0) {
					const foundCar = scrapedSaleList.find((c: scrapedDataType) => String(c.scrapedLotObj.lotNumber) === lotId);
					if (foundCar) {
						setCar(foundCar.scrapedLotObj);
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

	// // Load Otomoto listing check result
	// useEffect(() => {
	// 	if (car && !otomotoCheckRef.current) {
	// 		otomotoCheckRef.current = true;

	// 		const loadOtomotoListingCheck = async () => {
	// 			setOtomotoLoading(true);
	// 			try {
	// 				const response = await fetch('/api/otomoto-listing-check?action=load');
	// 				if (response.ok) {
	// 					const data = await response.json();
	// 					const carCheck = data.results?.find((r: OtomotoCheckRecord) => r.lotNumber === car.lotNumber);
	// 					if (carCheck) {
	// 						const searchQuery = `${car.make} ${car.model}`.toLowerCase();
	// 						setOtomotoResult({
	// 							lotNumber: car.lotNumber,
	// 							title: car.title,
	// 							make: car.make,
	// 							model: car.model,
	// 							searchQuery: searchQuery,
	// 							url: `https://www.otomoto.pl/osobowe/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`,
	// 							found: carCheck.listed_otomoto,
	// 							count: carCheck.listing_count,
	// 						});
	// 					} else {
	// 						// If car not in check results, run verification automatically
	// 						await runOtomotoVerification();
	// 					}
	// 				}
	// 			} catch (error) {
	// 				console.error('Error loading Otomoto listing check:', error);
	// 			} finally {
	// 				setOtomotoLoading(false);
	// 			}
	// 		};

	// 		loadOtomotoListingCheck();
	// 	}
	// }, [car]);

	const handleBack = () => {
		router.push(`/inventory`);
	};

	const toggleAIimage = () => {
		setAiImage(!AiImage);
	};

	// Function to run Otomoto verification for this car
	// const runOtomotoVerification = async () => {
	// 	if (!car) return;
	// 	setOtomotoLoading(true);
	// 	try {
	// 		// Send car details to API for verification
	// 		const response = await fetch('/api/otomoto-listing-check', {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify({
	// 				make: car.make,
	// 				model: car.model,
	// 				lotNumber: car.lotNumber,
	// 				year: car.year,
	// 				odometer: car.odometer,
	// 			}),
	// 		});

	// 		if (response.ok) {
	// 			const data = await response.json();
	// 			if (data.result) {
	// 				setOtomotoResult({
	// 					lotNumber: car.lotNumber,
	// 					title: car.title,
	// 					make: car.make,
	// 					model: car.model,
	// 					searchQuery: `${car.make} ${car.model}`.toLowerCase(),
	// 					url: `https://www.otomoto.pl/osobowe/${car.make.toLowerCase().replace(/\s+/g, '-')}/${car.model.toLowerCase().replace(/\s+/g, '-')}`,
	// 					found: data.result.listed_otomoto,
	// 					count: data.result.listing_count,
	// 				});
	// 			}
	// 		} else {
	// 			console.error('API error:', await response.text());
	// 		}
	// 	} catch (error) {
	// 		console.error('Error running Otomoto verification:', error);
	// 	} finally {
	// 		setOtomotoLoading(false);
	// 	}
	// };

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
						<div className='bg-white rounded-lg shadow p-6 mb-2'>
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

						<LotDetailsSection lotData={car}></LotDetailsSection>
					</div>

					{/* Right Column - Bidding Info */}
					<BidBuy car={car}></BidBuy>
				</div>
			</div>
		</div>
	);
}
