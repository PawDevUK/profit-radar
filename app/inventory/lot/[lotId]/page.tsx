'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@/app/components/common/spinner';
import { useState, useEffect } from 'react';
import LotDetailsSection from '@/app/inventory/lot/lotDetails';
import BidBuy from '../BidBuy';
import Img from 'next/image';
import Toggle from '@/app/components/common/toggler/toggler';
import { useIsLoading } from '@/lib/state/allCars.state';
import { useSingleLotStore } from '@/lib/state/lotDetailsPage.state';
import { carImagePlaceholder } from '@/img';

export default function LotDetailsPage() {
	const [isLoadingImages, setIsLoadingImages] = useState(true);
	const [loadedImageCound, setLoadedImageCound] = useState(0);
	const router = useRouter();
	const searchParams = useSearchParams();
	const isLoading = useIsLoading();
	const car = useSingleLotStore((state) => state.selectedLot);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [AiImage, setAiImage] = useState(false);
	const [aiImages] = useState<string[]>([]);
	const [loadedMainImageSrc, setLoadedMainImageSrc] = useState<string | null>(null);
	const imagesDoc = Array.isArray(car.images) ? (car.images as unknown as { copart: string[] | null }[])[0] : car.images;
	const images: string[] = imagesDoc?.copart ?? [];
	const page = searchParams.get('page');
	const mobile = innerWidth < 768;
	const aiImageMap: Record<number, string> = Object.fromEntries(
		aiImages
			.map((p) => {
				const m = p.match(/img-(\d+)-ai\.png$/);
				return m ? [parseInt(m[1], 10) - 1, p] : null;
			})
			.filter(Boolean) as [number, string][],
	);
	const currentSrc = AiImage && aiImageMap[selectedImageIndex] ? aiImageMap[selectedImageIndex] : images[selectedImageIndex];
	const isMainImageLoading = loadedMainImageSrc !== currentSrc;

	const handleBack = () => {
		if (page && car?.lotInv) {
			const backUrl = mobile ? `/inventory?page=${page}&mobile=true#lot-${car.lotInv}` : `/inventory?page=${page}#lot-${car.lotInv}`;
			router.push(backUrl);
			return;
		}
		router.back();
	};

	const toggleAIimage = () => {
		setAiImage((prev) => !prev);
	};

	useEffect(() => {
		if (loadedImageCound === images.length) {
			setIsLoadingImages(false);
		}
	}, [loadedImageCound, images.length]);

	if (isLoading) {
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
			<div className='absolute right-15 md:right-10 top-3 flex flex-row justify-between z-320 cursor-pointer'>
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

				<div className='grid grid-cols-1 lg:grid-cols-3 '>
					{/* Left Column - Main Info */}
					<div className='lg:col-span-2'>
						{/* Images */}
						<div className='bg-white rounded-lg shadow  mb-2'>
							{/* Main Image with Navigation */}
							<div className='mb-4 relative'>
								{/* {toggleAIImage()} */}
								{images.length > 0 ? (
									<>
										<div
											className={`relative w-full h-[283px] md:h-100 bg-gray-200  overflow-hidden  group rounded-t-md ${AiImage ? 'border-[var(--mongo-green)]' : 'border-white'}`}>
											{isMainImageLoading && (
												<div className='absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm'>
													<div className='h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--mongo-green)]' />
												</div>
											)}
											<Img
												alt='Car Image'
												src={currentSrc}
												className={`object-contain z-30 transition-opacity duration-300 ${isMainImageLoading ? 'opacity-0' : 'opacity-100'}`}
												fill
												sizes='(max-width: 1024px) 100vw, 66vw'
												onLoad={() => setLoadedMainImageSrc(currentSrc)}
												onError={(e) => {
													setLoadedMainImageSrc(currentSrc);
													e.currentTarget.src = '/images/placeholder.png';
												}}
											/>
											{!mobile && (
												<Img
													src={currentSrc}
													alt=''
													fill
													sizes='(max-width: 1024px) 100vw, 66vw'
													aria-hidden
													priority
													className='object-cover scale-110 blur-lg opacity-60'
													onError={(e) => {
														e.currentTarget.src = '/images/placeholder.png';
													}}
												/>
											)}
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
																<path stroke='currentColor' strokeLinecap='round' stroke-linejoin='round' stroke-width='2' d='m15 19-7-7 7-7' />
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
																<path stroke='currentColor' strokeLinecap='round' stroke-linejoin='round' stroke-width='2' d='m9 5 7 7-7 7' />
															</svg>
															<span className='sr-only'>Next</span>
														</span>
													</button>
												</>
											)}
										</div>
										<div className='relative w-full h-[57vw] lg:h-[38vw] max-h-[515px]'>
											{isLoadingImages ? <div className='h-[57vw] lg:h-[38vw] max-h-[515px] rounded-lg'>{Spinner('Images')}</div> : ''}
											<div className={`grid grid-cols-5 gap-2 p-3 relative left-0 right-0 ${isLoadingImages ? 'opacity-0' : 'opacity-100'}`}>
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
																	className='object-cover object-left'
																	fill
																	sizes='(max-width: 640px) 15vw, (max-width: 1024px) 12vw, 120px'
																	onLoad={() => setLoadedImageCound((c) => c + 1)}
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
								) : (
									<div className='relative w-full h-100 bg-gray-200 rounded overflow-hidden mb-4'>
										<Img
											alt='Car Image'
											src={carImagePlaceholder}
											className='object-contain z-30'
											fill
											sizes='(max-width: 1024px) 100vw, 66vw'
											onError={(e) => {
												e.currentTarget.src = '/images/placeholder.png';
											}}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
					<LotDetailsSection lotData={car}></LotDetailsSection>

					{/* Right Column - Bidding Info */}
					{/* <BidBuy car={car}></BidBuy> */}
				</div>
			</div>
		</div>
	);
}
