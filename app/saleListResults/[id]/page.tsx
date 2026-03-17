'use client';
import Card from '@/app/inventory/results/card/card';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import saleList from '@/app/results/saleList.json';
import { LotDetails } from '@/lib/types/lotDetails-type';
import { filter_Results_State } from '@/lib/state/searchFilters_STATE';

export default function SaleListResultsPage() {
	const { searchFilters } = filter_Results_State();
	const params = useParams();
	const router = useRouter();
	const saleId = params.id as string;
	const [cars, setCars] = useState<LotDetails[]>(saleList);
	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saleName, setSaleName] = useState<string | null>(null);
	const [saleMeta, setSaleMeta] = useState<{ location?: string; saleDate?: string; saleTime?: string } | null>(null);
	const fetchingRef = useRef(false); // Prevent duplicate fetching

	const filterResults = (selected: string, cars: LotDetails[]) => {
		return cars.filter((car) => car.make === selected);
	};

	useEffect(() => {
		console.log(searchFilters);
	}, [searchFilters]);

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
