'use client';

import { SearchChipButton } from '@/app/components/common/buttons/logButton';
import { useRef } from 'react';

interface Item {
	label: string;
	id: string;
}

const Items: Item[] = [
	{ label: 'Used Vehicles', id: 'used-vehicles' },
	{ label: 'Buy It Now', id: 'buy-it-now' },
	{ label: 'Run and Drive', id: 'run-and-drive' },
	{ label: 'No License Required', id: 'no-license-required' },
	{ label: 'Pure Sale Items', id: 'pure-sale-items' },
	{ label: 'Inspected', id: 'inspected' },
	{ label: 'Electric Vehicles', id: 'electric-vehicles' },
	{ label: 'Rentals', id: 'rentals' },
	{ label: 'Public and General Business', id: 'public-and-general-business' },
	{ label: 'Hot Items', id: 'hot-items' },
	{ label: 'Engine Start Program', id: 'engine-start-program' },
	{ label: 'Enhanced Vehicles', id: 'enhanced-vehicles' },
	{ label: 'Hybrid', id: 'hybrid' },
	{ label: 'Classics', id: 'classics' },
	{ label: 'Exotics', id: 'exotics' },
	{ label: 'Featured Vehicles', id: 'featured-vehicles' },
	{ label: 'Seller Certified', id: 'seller-certified' },
	{ label: 'Offsite Sales', id: 'offsite-sales' },
	{ label: 'Recovered Thefts', id: 'recovered-thefts' },
	{ label: 'Fleet / Lease', id: 'fleet-lease' },
	{ label: 'Bank / Repossessed', id: 'bank-repossessed' },
	{ label: 'Specialty Vehicles', id: 'specialty-vehicles' },
];

export default function SearchFilters() {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
		}
	};

	const scrollRight = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
		}
	};

	return (
		<div className='flex items-center h-10'>
			<div className='flex mx-3 z-10 w-31.75 shrink-0 justify-center'>Featured items:</div>
			<div className='flex flex-row items-center w-full'>
				<button title='Scroll to Left' className='  z-110 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50' onClick={scrollLeft}>
					<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
					</svg>
				</button>
				<div className='relative flex overflow-hidden '>
					<div ref={scrollRef} className='flex w-full overflow-hidden scroll-smooth' tabIndex={0} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
						<style jsx>{`
							div::-webkit-scrollbar {
								display: none;
							}
						`}</style>
						{Items.map((item) => (
							<div key={item.id} className='cursor-pointer ml-2 '>
								<SearchChipButton item={{ href: `#${item.id}`, label: item.label }} />
							</div>
						))}
					</div>
				</div>
				<button title='Scroll to Right' className='absolute z-10 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50' onClick={scrollRight}>
					<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
					</svg>
				</button>
			</div>
		</div>
	);
}
