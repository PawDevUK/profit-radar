'use client';
import { useRouter } from 'next/navigation';
import Card from '@/app/inventory/saleListResults/[id]/card/card';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { setFilterResults_State } from '@/lib/state/searchFilters.state';
import { allCars_State } from '@/lib/state/allCars.state';
import { useMemo, useState } from 'react';
import _ from 'lodash';
import { SelectSingleLot } from '@/lib/state/allCars.state';

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

export default function SaleListResultsPage() {
	const { searchFilters } = setFilterResults_State();
	const cars = allCars_State((state) => state.allCars);
	const isLoading = allCars_State((state) => state.isLoading);
	const error = allCars_State((state) => state.error);
	const router = useRouter();
	const [requestedPage, setRequestedPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);

	const filteredCars = cars;
	const totalPages = Math.max(1, Math.ceil(filteredCars.length / itemsPerPage));
	const currentPage = Math.min(requestedPage, totalPages);
	const pages = useMemo(() => getVisiblePages(totalPages, currentPage), [totalPages, currentPage]);
	const visibleCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const setSelectedLot = SelectSingleLot((state) => state.setSelectedLot);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-white flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading inventory list...</p>
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
			<div className='w-full min-h-screen bg-white py-3 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-(--max-app-width) mx-auto'>
					<div className='flex flex-wrap justify-center max-h=[1580px] gap-0.2'>
						{visibleCars.map((car, index) => (
							<Card
								key={index}
								item={car}
								onClick={() => {
									setSelectedLot(car);
									router.push(`/inventory/lot/${car.lotInv}`);
								}}></Card>
						))}
					</div>
				</div>
				<Pagination pages={pages} totalItems={filteredCars.length} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setRequestedPage} />
			</div>
		);
	}
	if (filteredCars && filteredCars.length === 0 && !isLoading) {
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

	return null;
}
