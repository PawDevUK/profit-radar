'use client';
import Card from '@/app/inventory/results/card/card';
import { useState } from 'react';
import saleList from '@/app/results/saleList.json';
import { LotDetails } from '@/lib/types/lotDetails-type';
import { filter_Results_State } from '@/lib/state/searchFilters_STATE';

export default function SaleListResultsPage() {
	const { searchFilters } = filter_Results_State();
	const [cars] = useState<LotDetails[]>(saleList);

	const filterResults = (selected: string, cars: LotDetails[]) => {
		return cars.filter((car) => car.make === selected);
	};

	return (
		<div className='w-full min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-(--max-app-width) mx-auto'>
				<div className='flex flex-wrap justify-center'>
					{cars.map((car, index) => (
						<Card key={index} item={car}></Card>
					))}
				</div>

				{filterResults(searchFilters.make, cars).length === 0 && (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>No cars found for this sale</p>
					</div>
				)}
			</div>
		</div>
	);
}
