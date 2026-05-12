'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import Card from '@/app/inventory/saleListResults/[id]/card/card';
import { useFilterResultsStore } from '@/lib/state/searchFilters.state';
import { SearchFilters } from '@/lib/types/searchFilters-type';
import { useAllCarsStore } from '@/lib/state/allCars.state';
import { useSingleLotStore } from '@/lib/state/lotDetailsPage.state';
import { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

type PaginationProps = {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pages: number[];
};

const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage, pages }: PaginationProps) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<div className='flex justify-center items-center space-x-2 mt-4'>
			<button className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-(--main-blue) text-white'}`} onClick={handlePrevious} disabled={currentPage === 1}>
				Previous
			</button>
			<div className='flex space-x-2'>
				{pages.map((page) => (
					<button key={page} className={`px-4 py-2 rounded ${currentPage === page ? 'bg-(--main-blue) text-white' : 'bg-gray-200'}`} onClick={() => setCurrentPage(page)}>
						{page}
					</button>
				))}
			</div>
			<button
				className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-(--main-blue) text-white'}`}
				onClick={handleNext}
				disabled={currentPage === totalPages}>
				Next
			</button>
		</div>
	);
};

const getVisiblePages = (totalPages: number, currentPage: number, maxVisiblePages = 5): number[] => {
	if (totalPages <= maxVisiblePages) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const half = Math.floor(maxVisiblePages / 2);
	let start = Math.max(1, currentPage - half);
	let end = start + maxVisiblePages - 1;

	if (end > totalPages) {
		end = totalPages;
		start = end - maxVisiblePages + 1;
	}

	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

function applyFilter(filters: SearchFilters, carsState: LotDetailsType[]) {
	const filteredCars: LotDetailsType[] = carsState.filter((car: LotDetailsType) => car.make === filters.make);
	return filteredCars && filteredCars.length > 0 ? filteredCars : carsState;
}

export default function SaleListResultsPage() {
	const cars = useAllCarsStore((state) => state.allCars);
	const isLoading = useAllCarsStore((state) => state.isLoading);
	const error = useAllCarsStore((state) => state.error);
	const filters = useFilterResultsStore((state) => state.searchFilters);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [requestedPage, setRequestedPage] = useState(getCurrentPageFromURL());
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [mobilePage, setMobilePage] = useState(true);
	const [loadingPage, setLoadingPage] = useState(true);
	const filteredCars = applyFilter(filters, cars);
	const totalPages = Math.max(1, Math.ceil(filteredCars.length / itemsPerPage));
	const currentPage = Math.min(requestedPage, totalPages);
	const pages = useMemo(() => getVisiblePages(totalPages, currentPage), [totalPages, currentPage]);
	const visibleCars = mobilePage ? filteredCars.slice(0, currentPage * itemsPerPage) : filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const setSelectedLot = useSingleLotStore((state) => state.setSelectedLot);
	function getCurrentPageFromURL() {
		return parseInt(searchParams.get('page') || '1', 10);
	}
	useEffect(() => {
		const innerWidth = window.innerWidth;
		setMobilePage(innerWidth < 768);
	}, [mobilePage]);

	useEffect(() => {
		if (!mobilePage) return;

		const handleScroll = () => {
			const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
			if (isAtBottom && currentPage < totalPages) {
				setRequestedPage((prev) => prev + 1);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [mobilePage, currentPage, totalPages]);

	useEffect(() => {
		const page = searchParams.get('page');
		setRequestedPage(page ? parseInt(page, 10) : 1);
	}, []);

	useEffect(() => {
		setLoadingPage(false);
	});

	if (loadingPage) {
		return (
			<div className='min-h-screen bg-white flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading inventory list...</p>
				</div>
			</div>
		);
	}

	if (!isLoading && !loadingPage && visibleCars && visibleCars.length === 0) {
		return (
			<div className='w-full min-h-screen bg-white py-3 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-(--max-app-width) mx-auto'>
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>No cars found for this sale</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='w-full min-h-screen bg-white py-3 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-(--max-app-width) mx-auto'>
					<div className='text-center py-12'>
						<p className='text-red-600 text-lg'>Failed to load sale list: {error}</p>
					</div>
				</div>
			</div>
		);
	}

	if (visibleCars && visibleCars.length > 0) {
		return (
			<div className='w-full min-h-screen bg-white pb-3 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-(--max-app-width) mx-auto'>
					<div className='flex flex-wrap justify-center max-h=[1580px] gap-0.2'>
						{visibleCars.map((car: LotDetailsType, index: number) => (
							<Card
								key={index}
								item={car}
								onClick={() => {
									setSelectedLot(car);
									router.push(`/inventory/lot/${car.lotInv}?page=${currentPage}&mobile=${mobilePage}`);
								}}></Card>
						))}
					</div>
				</div>
				{!mobilePage ? (
					<Pagination pages={pages} totalItems={filteredCars.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setRequestedPage} />
				) : (
					''
				)}
			</div>
		);
	}

	return null;
}
