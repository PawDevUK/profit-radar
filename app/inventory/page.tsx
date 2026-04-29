'use client';
import { lazy, memo, Suspense, useState, useTransition } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import SaleListResultsPage from './saleListResults/[id]/page';

import SearchChipsFilters from './searchChipsFilters/searchChipsFilters';

const SideSearch = lazy(() => import('./SearchComponent/Search'));
const MemoizedSaleListResultsPage = memo(SaleListResultsPage);

import { chipFilters_State } from '@/lib/state/chipFilters.state';

const ToggleButton = ({ toggleFilters }: { toggleFilters: () => void }) => {
	const IconSize = 22;
	return (
		<button className='button-blue' onClick={toggleFilters}>
			{<SlidersHorizontal id='slidersIcon' className='ml-1 text-white mr-1' size={IconSize}></SlidersHorizontal>}
			Filter and sort
		</button>
	);
};

const CloseButton = ({ toggleFilters }: { toggleFilters: () => void }) => {
	return (
		<button className='w-8 h-8' onClick={toggleFilters}>
			{<X id='closeButton' className='ml-2 checkboxIcon' />}
		</button>
	);
};

export default function Page() {
	const { selectedFilters } = chipFilters_State();
	const [open, setOpen] = useState(false);
	const [, startTransition] = useTransition();

	const toggleFilters = () => {
		startTransition(() => {
			setOpen((prev) => !prev);
		});
	};

	const resetAllFilters = function () {};

	return (
		<div className='relative min-h-screen flex flex-col'>
			<div className='h-15 w-full bg-white'>
				<div className='px-4 py-3 flex flex-row justify-end md:justify-center items-center'>
					<div className='w-[70%] mr-4 hidden md:block overflow-hidden'>
						<SearchChipsFilters />
					</div>
					<div className='w-39.75 flex '>
						<ToggleButton toggleFilters={toggleFilters} />
					</div>
				</div>
				{open ? (
					<aside className='flex flex-col relative z-20 left-0 -top-50 w-[calc(100vw-20px)] lg:w-150 mx-auto h-[calc(100vh-30px)] bg-white rounded-lg shadow-lg md:shadow-none overflow-y-auto'>
						<div className='px-10 py-6 flex items-center justify-between'>
							<h2 className='text-[22px] font-bold text-(--header-text)'>Filter and sort</h2>
							<div className='flex items-center gap-2'>
								<button onClick={resetAllFilters} className='resetButton'>
									Reset All
								</button>
								<CloseButton toggleFilters={toggleFilters} />
							</div>
						</div>
						<Suspense fallback={<div className='p-4 text-gray-500'>Loading filters...</div>}>
							<SideSearch />
						</Suspense>
					</aside>
				) : (
					<div></div>
				)}

				{open && <div className='fixed  inset-0 z-10 bg-black/50' onClick={() => startTransition(() => setOpen(false))} />}
			</div>
			<div className='w-full  md:ml-0 '>
				<MemoizedSaleListResultsPage />
			</div>
		</div>
	);
}
