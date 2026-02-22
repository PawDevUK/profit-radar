'use client';
import React, { useState } from 'react';
import Toggler from '../components/common/toggler/toggler';
import CollapseCard from '../components/common/collapseCard/collapseCard';
import Make from './search/make';
import Model from './search/model';
import { SquareChevronRight, SquareChevronLeft } from 'lucide-react';

const ToggleButton = ({ open, toggleFilters }: { open: boolean; toggleFilters: () => void }) => {
	const IconSize = 26;
	return (
		<button className='' onClick={toggleFilters}>
			{open ? <SquareChevronLeft className='ml-2 text-(--mongo-green)' size={IconSize} /> : <SquareChevronRight className='ml-2 text-(--header-text)' size={IconSize} />}
		</button>
	);
};

export default function Page() {
	const [open, setOpen] = useState(false);
	const [showSidebar, setShowSidebar] = useState(false);

	const toggleFilters = () => {
		setOpen((prev) => !prev);
		if (!open) {
			setShowSidebar(false);
		}
	};

	return (
		<div>
			{/* Search and filter section */}
			{open ? (
				<aside
					className='w-70 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-500 ease-in-out'
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
						{showSidebar ? (
							<div>
								<Make />
								<Model />
								<CollapseCard title='Search filters'>
									<div className='flex items-center justify-between mb-2'>
										<span className='font-semibold'>Vehicles only</span>
									</div>
								</CollapseCard>
								{/* <div className='flex items-center justify-between px-6 pt-6 mb-10'>
							<div className='flex items-center'>
								<h4 className='text-lg font-bold text-blue-700 m-0'>Search filters</h4>
								<button className='ml-5 text-blue-600 cursor-pointer text-sm font-medium hover:underline'>Reset All</button>
							</div> */}
								{/* <button className='text-gray-400 hover:text-blue-600'>
								<span className='material-icons'>expand_more</span>
							</button> */}
								{/* </div> */}
								<CollapseCard title='Rest of filters	'>
									<div className='flex-1 overflow-y-auto px-6'>
										{/* Vehicles only toggle */}
										<div className='mb-6 flex items-center justify-between'>
											<div className='flex items-center'>
												<span className='font-semibold text-black'>Vehicles only</span>
											</div>
											<Toggler />
										</div>
										{/* Newly added vehicles toggle and dropdown */}
										<div className='mb-6 flex items-center justify-between'>
											<span className='font-semibold text-black'>Newly added vehicles</span>
											<select className='border rounded px-2 py-1 text-sm mr-2'>
												<option>Last 24 Hours</option>
												<option>Last 7 Days</option>
												<option>Last 30 Days</option>
											</select>
											<Toggler />
										</div>
										{/* Exclude upcoming auction vehicles toggle */}
										<div className='mb-6 flex items-center justify-between'>
											<span className='font-semibold text-black'>Exclude upcoming auction vehicles</span>
											<Toggler />
										</div>
										{/* Exclude Purple Wave lots toggle */}
										<div className='mb-6 flex items-center justify-between'>
											<span className='font-semibold text-black'>Exclude Purple Wave lots</span>
											<Toggler />
										</div>
										{/* Vehicle title type checkboxes */}
										<div className='mb-6'>
											<div className='flex items-center justify-between mb-2'>
												<span className='font-semibold'>Vehicle title type</span>
												<button className='text-blue-600 text-xs hover:underline'>Reset</button>
											</div>
											<div className='space-y-2'>
												<label className='flex items-center'>
													<Toggler />
													Clean Title <span className='ml-2 text-xs text-gray-500'>(10,000+)</span>
												</label>
												<label className='flex items-center'>
													<Toggler />
													NonRepairable <span className='ml-2 text-xs text-gray-500'>(1,000+)</span>
												</label>
												<label className='flex items-center'>
													<Toggler />
													Salvage Title <span className='ml-2 text-xs text-gray-500'>(10,000+)</span>
												</label>
											</div>
										</div>
										{/* Odometer slider */}
										<div className='mb-6'>
											<div className='flex items-center justify-between mb-2'>
												<span className='font-semibold'>Odometer</span>
												<button className='text-blue-600 text-xs hover:underline'>Reset</button>
											</div>
											<input type='range' min='0' max='300000' className='w-full' />
										</div>
										{/* Year range slider */}
										<div className='mb-6'>
											<div className='flex items-center justify-between mb-2'>
												<span className='font-semibold'>Year</span>
												<button className='text-blue-600 text-xs hover:underline'>Reset</button>
											</div>
											<input type='range' min='1990' max='2026' className='w-full' />
										</div>
										{/* Vehicle condition type checkboxes */}
										<div className='mb-6'>
											<div className='flex items-center justify-between mb-2'>
												<span className='font-semibold'>Vehicle condition type</span>
												<button className='text-blue-600 text-xs hover:underline'>Reset</button>
											</div>
											<div className='space-y-2'>
												<label className='flex items-center'>
													<Toggler />
													Excellent
												</label>
												<label className='flex items-center'>
													<Toggler />
													Good
												</label>
												<label className='flex items-center'>
													<Toggler />
													Fair
												</label>
											</div>
										</div>
										{/* Search near ZIP code input and dropdown */}
										<div className='mb-6'>
											<div className='flex items-center justify-between mb-2'>
												<span className='font-semibold'>Search near ZIP code</span>
												<button className='text-blue-600 text-xs hover:underline'>Reset</button>
											</div>
											<div className='flex'>
												<input type='text' placeholder='Zip code' className='border rounded px-2 py-1 mr-2 w-24' />
												<select className='border rounded px-2 py-1 text-sm'>
													<option>50 mi</option>
													<option>100 mi</option>
													<option>200 mi</option>
												</select>
												<button className='ml-2 bg-blue-600 text-white px-3 py-1 rounded text-xs' disabled>
													Search
												</button>
											</div>
										</div>
										{/* Sale date calendar filter */}
										<div className='mb-6'>
											<div className='flex items-center justify-between mb-2'>
												<span className='font-semibold'>Sale date</span>
												<button className='text-blue-600 text-xs hover:underline'>Reset</button>
											</div>
											<div className='flex flex-col space-y-2'>
												<div className='flex items-center'>
													<span className='mr-2'>From:</span>
													<input type='date' className='border rounded px-2 py-1' />
												</div>
												<div className='flex items-center'>
													<span className='mr-2'>To:</span>
													<input type='date' className='border rounded px-2 py-1' />
												</div>
											</div>
										</div>
									</div>
								</CollapseCard>
							</div>
						) : (
							<div></div>
						)}
					</>
				</aside>
			) : (
				<aside className='w-15 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-500 ease-in-out'>
					<div className='px-4 py-3 flex justify-end'>
						<ToggleButton open={open} toggleFilters={toggleFilters} />
					</div>
				</aside>
			)}
			{/* Inventory list */}
			<div></div>
		</div>
	);
}
