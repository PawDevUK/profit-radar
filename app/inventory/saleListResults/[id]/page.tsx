'use client';
import { useRouter } from 'next/navigation';
import Card from '@/app/inventory/saleListResults/[id]/card/card';
import { LotDetailsType } from '@/lib/types/lotDetails-type';
import { filter_Results_State } from '@/lib/state/searchFilters.state';
import { allCars_State } from '@/lib/state/allCars.state';

export default function SaleListResultsPage() {
	const { searchFilters } = filter_Results_State();
	const cars = allCars_State((state) => state.allCars);
	const isLoading = allCars_State((state) => state.isLoading);
	const router = useRouter();

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
