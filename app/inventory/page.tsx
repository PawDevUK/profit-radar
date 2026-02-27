'use client';
import { useState } from 'react';
import { SquareChevronRight, SquareChevronLeft } from 'lucide-react';
import Results from './results/results';
import SideSearch from './sideSearchComponent/sideSearch';

const ToggleButton = ({ open, toggleFilters }: { open: boolean; toggleFilters: () => void }) => {
	const IconSize = 26;
	return (
		<button className='' onClick={toggleFilters}>
			{open ? <SquareChevronLeft className='ml-2 text-(--mongo-green)' size={IconSize} /> : <SquareChevronRight className='ml-2 text-(--header-text)' size={IconSize} />}
		</button>
	);
};

export default function Page() {
	const [open, setOpen] = useState(true);
	const [showSidebar, setShowSidebar] = useState(true);
	// const [filteredCars, setFilteredCars] = useState<string[]>([]);

	const toggleFilters = () => {
		setOpen((prev) => !prev);
		if (!open) {
			setShowSidebar(false);
		}
	};

	const getFilteredLot = (cars: string[]) => {
		// setFilteredCars(cars);
	};

	return (
		<div className='flex flex-row'>
			{open ? (
				<aside
					className='w-70 bg-white shadow-lg border-r border-gray-200 min-h-screen sticky top-0 flex flex-col transition-all duration-500 ease-in-out'
					onTransitionEnd={() => {
						setShowSidebar(true);
					}}>
					<>
						<div className='px-4 py-3 flex *:items-center justify-between'>
							{showSidebar ? (
								<div className='flex items-center justify-between w-45'>
									<h2 className='text-[16px] font-bold text-(--header-text)'>Search filters</h2>
									<button className='text-(--header-text) cursor-pointer text-xs mt-0.5 font-medium hover:underline'>Reset All</button>
								</div>
							) : (
								<div></div>
							)}
							<ToggleButton open={open} toggleFilters={toggleFilters} />
						</div>
						{showSidebar ? <SideSearch filteredSaleResults={getFilteredLot} /> : <div></div>}
					</>
				</aside>
			) : (
				<aside className='w-15 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-500 ease-in-out'>
					<div className='px-4 py-3 flex justify-end'>
						<ToggleButton open={open} toggleFilters={toggleFilters} />
					</div>
				</aside>
			)}

			<div className=''>{/* <Results>{filteredCars}</Results> */}</div>
		</div>
	);
}
