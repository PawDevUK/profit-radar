'use client';
import { useRouter } from 'next/navigation';
import Card from '@/app/inventory/saleListResults/[id]/card/card';
import { useState, useEffect } from 'react';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { filter_Results_State } from '@/lib/state/searchFilters.state';
import { CalendarMonthType, SaleListType } from '@/lib/types/calendar-type';

export default function SaleListResultsPage() {
	const { searchFilters } = filter_Results_State();
	const [cars, setCars] = useState<LotDetailsType[]>([]);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchedDB = async () => {
			setIsLoading(true);
			await fetch(`/api/copart/db/getAllSaleLists`)
				.then((res) => res.json())
				.then((data) => {
					if (Array.isArray(data) && data.length > 0) {
						const allAuctions: SaleListType[] = [];
						const allCars: LotDetailsType[] = [];

						data.forEach((month: CalendarMonthType) => {
							if (Array.isArray(month.auctions)) {
								allAuctions.push(...month.auctions);
							}
						});

						if (allAuctions.length > 0) {
							allAuctions.forEach((auction: SaleListType) => {
								if (Array.isArray(auction.lotList)) {
									allCars.push(...auction.lotList);
								}
							});
						}

						setCars(allCars);
					} else {
						console.log('No sales lists found in the database');
					}
					setIsLoading(false);
				});
		};
		void fetchedDB();
	}, []);

	const filterResults = (selected: string, cars: LotDetailsType[]) => {
		if (!selected) return cars;
		return cars.filter((car) => car.make === selected);
	};

	const visibleCars = filterResults(searchFilters.make, cars);
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

	if (visibleCars.length > 0) {
		return (
			<div className='w-full min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-(--max-app-width) mx-auto'>
					<div className='flex flex-wrap justify-center'>
						{visibleCars.map((car, index) => (
							<Card
								key={index}
								item={car}
								onClick={() => {
									router.push(`/inventory/lot/${car.lotNumber}`);
								}}></Card>
						))}
					</div>
				</div>
			</div>
		);
	}
	if (visibleCars.length === 0 && !isLoading) {
		return (
			<div className='w-full min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-(--max-app-width) mx-auto'>
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>No cars found for this sale</p>
					</div>
				</div>
			</div>
		);
	}
}
