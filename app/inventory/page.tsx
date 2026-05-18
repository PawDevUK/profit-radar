'use client';
import { memo, Suspense } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SaleListResultsPage from './saleListResults/[id]/page';
import SearchChipsFilters from './searchChipsFilters/searchChipsFilters';
const MemoizedSaleListResultsPage = memo(SaleListResultsPage);

import { useSetOpenSearch } from '@/lib/state/openSearch.state';
const ToggleButton = ({ toggleFilters }: { toggleFilters: () => void }) => {
	const IconSize = 22;
	return (
		<button className='button-blue' onClick={toggleFilters}>
			{<SlidersHorizontal id='slidersIcon' className='ml-1 text-white mr-1' size={IconSize}></SlidersHorizontal>}
			Filter and sort
		</button>
	);
};

export default function Page() {
	const toggleOpenSearch = useSetOpenSearch();
	const toggleFilters = () => {
		toggleOpenSearch();
	};

	return (
		<div className='relative min-h-screen flex flex-col'>
			<div className='h-15 w-full bg-white pt-3 pr-1.25 md:p-2 '>
				<div className='px-4 flex flex-row justify-end md:justify-center items-center'>
					<div className='w-[70%] mr-4 hidden md:block overflow-hidden'>
						<SearchChipsFilters />
					</div>
					<div className='w-39.75 flex '>
						<ToggleButton toggleFilters={toggleFilters} />
					</div>
				</div>
			</div>
			<div className='w-full  md:ml-0 '>
				<Suspense fallback={<div className='p-4 text-gray-500'>Loading inventory...</div>}>
					<MemoizedSaleListResultsPage />
				</Suspense>
			</div>
		</div>
	);
}
