'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const MobileImages = ({ item }: { item: React.ComponentProps<typeof Card>['item'] }) => {
	return (
		<div className='flex flex-row  w-full'>
			<div className='w-2/3'>
				<Image className='rounded-t-lg w-full' src={item.images?.[0] || '/placeholder-image.png'} alt='lot image' width={300} height={300} />
			</div>
			<div className='w-1/3 flex'>
				<div className='w-1/2'>
					<Image className='rounded-t-lg w-full' src={item.images?.[0] || '/placeholder-image.png'} alt='lot image' width={300} height={300} />
				</div>
				<div className='w-1/2'>
					<Image className='rounded-t-lg w-full' src={item.images?.[0] || '/placeholder-image.png'} alt='lot image' width={300} height={300} />
				</div>
			</div>
		</div>
	);
};

function Card({ ...props }) {
	const { item } = props;
	return (
		<div className='md:max-h-112.5 w-full max-w-sm md:w-[30%] lg:w-[22%] xl:w-[18%] m-2.5 bg-neutral-primary-soft border border-gray-300 rounded-base shadow-md rounded-lg flex flex-col'>
			{/* Show MobileImages only on mobile */}
			<div className='md:hidden'>
				<MobileImages item={item} />
			</div>
			{/* Show main image only on md and up */}
			<a href='#' className='hidden md:block'>
				<Image className='rounded-t-lg w-full' src={item.images?.[0] || '/placeholder-image.png'} alt='lot image' width={300} height={300} />
			</a>

			<div className='p-2 flex flex-col justify-between flex-1'>
				<div className='flex flex-col'>
					<div className=' flex items-center space-x-3 mb-1'>
						<span>Lot number:</span>
						<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.lotNumber}</span>
					</div>
					<a className='' href='#'>
						<h5 className='text-lg text-heading font-semibold tracking-tight'>{item.title}</h5>
					</a>
				</div>
				<div className='flex flex-col items-center mt-1 '>
					<div className='flex flex-col'>
						<div className=' flex flex-row items-center space-x-1 mb-1'>
							<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.odometer} miles</span>
							{item.hasKey ? (
								<span className='border border-brand-subtle text-green-600  text-xs font-medium px-1.5 py-0.5 rounded-sm'>keys</span>
							) : (
								<span className='border border-brand-subtle text-red-600  text-xs font-medium px-1.5 py-0.5 rounded-sm'>no keys</span>
							)}
							<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.year}</span>
						</div>
						<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 m-auto rounded-sm'>{item.primaryDamage}</span>
					</div>

					<div className='flex flex-row space-x-4 mt-1'>
						<div className='flex flex-col'>
							<span className='text-[12px]'>Current Bid</span>
							<span className='text-xl font-extrabold text-heading'>${item.currentBid}</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-[12px]'>Buy it now</span>
							<span className='text-xl font-extrabold text-heading'>${item.buyItNow}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Card;
