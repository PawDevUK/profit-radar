'use client';

import scrapedSaleList from '@/lib/scrapers/copart/saleList/scrapedSaleList.json' with { type: 'json' };
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { scrapedDataType, LotDetails } from '@/lib/types/lotDetails-type';
import saleList from '@/app/results/saleList.json';
import LogButton from '@/app/components/common/buttons/logButton';
import LotDetailsSection from '@/app/inventory/lot/lotDetails';
import BidBuy from '../BidBuy';
import Img from 'next/image';
import Toggle from '@/app/components/common/toggler/toggler';

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
	const [AiImage, setAiImage] = useState(false);
	const [aiImages, setAiImages] = useState<string[]>([]);

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
						const lotNumber = foundCar.scrapedLotObj.lotNumber;
						if (lotNumber) {
							fetch(`/api/copart/local-ai-images?lotId=${lotNumber}`)
								.then((r) => r.json())
								.then((data) => setAiImages(data.images ?? []))
								.catch(() => setAiImages([]));
						}
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
		setAiImage((prev) => !prev);
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

	function toggleAIImage() {
		return (
			<div className='absolute right-15 md:right-10  top-3 flex flex-row justify-between z-320 cursor-pointer'>
				<div className='w-45 mb-4 relative '>
					{AiImage ? (
						<div className='image-ai-label flex justify-start items-center h-10 w-41 pl-2' onClick={() => setAiImage(false)}>
							AI Repaired
						</div>
					) : (
						<div className='image-original-label flex justify-start items-center h-10 w-41 pl-5' onClick={() => setAiImage(true)}>
							Original
						</div>
					)}
					<div className='absolute top-[9px] end-[22px] z-40'>
						<Toggle enabled={AiImage} size={1.2} onChange={toggleAIimage} colour='--mongo-green-light' />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<button onClick={() => handleBack()} className='text-[var(--header-text)] hover:text-[var(--mongo-green)] font-medium mb-5'>
					← Back to Sale List
				</button>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column - Main Info */}
					<div className='lg:col-span-2'>
						{/* Images */}
						<div className='bg-white rounded-lg shadow p-6 mb-2'>
							{/* Main Image with Navigation */}
							<div className='mb-4 relative'>
								{toggleAIImage()}
								{(() => {
									const images = car.images ?? [];
									// Build map: original index -> AI image path, parsed from img-001-ai.png naming
									const aiImageMap: Record<number, string> = Object.fromEntries(
										aiImages
											.map((p) => {
												const m = p.match(/img-(\d+)-ai\.png$/);
												return m ? [parseInt(m[1], 10) - 1, p] : null;
											})
											.filter(Boolean) as [number, string][],
									);
									const currentSrc = AiImage && aiImageMap[selectedImageIndex] ? aiImageMap[selectedImageIndex] : images[selectedImageIndex];
									return images.length > 0 ? (
										<>
											<div
												className={`relative w-full h-100 bg-gray-200 rounded overflow-hidden mb-4 group border-4 ${AiImage ? 'border-[var(--mongo-green)]' : 'border-white'}`}>
												<Img
													alt='Car Image'
													src={currentSrc}
													className='object-contain z-30'
													fill
													onError={(e) => {
														e.currentTarget.src = '/images/placeholder.png';
													}}
												/>
												<div className=''></div>
												<Img
													src={currentSrc}
													alt=''
													fill
													aria-hidden
													priority
													className='object-cover scale-110 blur-lg opacity-60'
													onError={(e) => {
														e.currentTarget.src = '/images/placeholder.png';
													}}
												/>
												<div className='z-50'></div>
												{images.length > 1 && (
													<>
														<button
															onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
															type='button'
															className='absolute top-0 start-0 z-40 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none '
															data-carousel-prev>
															<span className='inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60  group-focus:outline-none rounded-md'>
																<svg
																	className='w-5 h-5 text-white rtl:rotate-180'
																	aria-hidden='true'
																	xmlns='http://www.w3.org/2000/svg'
																	width='24'
																	height='24'
																	fill='none'
																	viewBox='0 0 24 24'>
																	<path
																		stroke='currentColor'
																		stroke-linecap='round'
																		stroke-linejoin='round'
																		stroke-width='2'
																		d='m15 19-7-7 7-7'
																	/>
																</svg>
																<span className='sr-only'>Previous</span>
															</span>
														</button>
														<button
															type='button'
															className='absolute top-0 end-0 z-40 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
															onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
															data-carousel-next>
															<span className='inline-flex items-center justify-center w-10 h-10 rounded-base bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-focus:ring-gray-800/70 group-focus:outline-none rounded-md'>
																<svg
																	className='w-5 h-5 text-white rtl:rotate-180'
																	aria-hidden='true'
																	xmlns='http://www.w3.org/2000/svg'
																	width='24'
																	height='24'
																	fill='none'
																	viewBox='0 0 24 24'>
																	<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m9 5 7 7-7 7' />
																</svg>
																<span className='sr-only'>Next</span>
															</span>
														</button>
													</>
												)}
											</div>
											<div>
												<div className='grid grid-cols-6 gap-2'>
													{images.length > 1
														? images.map((imgUrl: string, idx) => (
																<button
																	key={idx}
																	onClick={() => setSelectedImageIndex(idx)}
																	title={`Image ${idx + 1}`}
																	className={`relative aspect-square rounded overflow-hidden border-2 transition-all hover:scale-105 ${
																		selectedImageIndex === idx
																			? 'border-blue-600 ring-2 ring-blue-400 ring-offset-1'
																			: 'border-gray-300 hover:border-blue-400'
																	}`}>
																	<Img
																		src={AiImage && aiImageMap[idx] ? aiImageMap[idx] : imgUrl}
																		alt={`Thumbnail ${idx + 1}`}
																		className='object-cover'
																		fill
																		onError={(e) => {
																			e.currentTarget.src = '/images/placeholder.png';
																		}}
																	/>
																</button>
															))
														: null}
												</div>
											</div>
										</>
									) : null;
								})()}
								{!car.images?.length && !AiImage && (
									<div className='w-full h-[400px] bg-gray-100 rounded flex items-center justify-center border-2 border-gray-200'>
										<div className='text-center'>
											<p className='text-gray-400 text-lg'>No Images Available</p>
											<p className='text-gray-500 text-sm mt-2'>Check Copart for vehicle images</p>
										</div>
									</div>
								)}
							</div>
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
