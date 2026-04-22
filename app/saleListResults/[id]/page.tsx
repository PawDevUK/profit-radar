'use client';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/app/inventory/results/card/card';
import { useState } from 'react';
import scrapedSaleList from '@/lib/scrapers/copart/saleList/scrapedSaleList.json' with { type: 'json' };
import { scrapedLotDataType } from '@/lib/types/lotDetails-type';
import { filter_Results_State } from '@/lib/state/searchFilters.state';

export default function SaleListResultsPage() {
	const { searchFilters } = filter_Results_State();
	const [cars] = useState<scrapedLotDataType[]>(scrapedSaleList);
	const router = useRouter();

	const filterResults = (selected: string, cars: scrapedLotDataType[]) => {
		if (!selected) return cars;
		return cars.filter((car) => car.scrapedLotObj.make === selected);
	};

	const visibleCars = filterResults(searchFilters.make, cars);

	return (
		<div className='w-full min-h-screen bg-gray-50 py-3 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-(--max-app-width) mx-auto'>
				<div className='flex flex-wrap justify-center'>
					{visibleCars.map((car, index) => (
						<Card
							key={index}
							item={car.scrapedLotObj}
							onClick={() => {
								router.push(`/inventory/lot/${car.scrapedLotObj.lotNumber}`);
							}}></Card>
					))}
				</div>

				{visibleCars.length === 0 && (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>No cars found for this sale</p>
					</div>
				)}
			</div>
		</div>
	);
}
