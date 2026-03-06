'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

function Card({ ...props }) {
	const { item } = props;
	return (
		<div className='w-full max-w-sm md:w-[30%] lg:w-[20%] xl:w-[18%] m-2.5 bg-neutral-primary-soft border border-gray-300 rounded-base shadow-md rounded-lg'>
			<a href='#'>
				<Image className='rounded-t-lg w-full' src={item.images?.[0] || '/placeholder-image.png'} alt='lot image' width={300} height={300} />
			</a>
			<div className='p-2'>
				<div className='flex items-center space-x-3 mb-1'>
					<span>Lot number:</span>
					<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.lotNumber}</span>
				</div>
				<a href='#'>
					<h5 className='text-lg text-heading font-semibold tracking-tight'>{item.title}</h5>
				</a>
				<div className='flex flex-col items-center justify-between mt-6'>
					<div className='flex flex-row items-center space-x-1 mb-1'>
						<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.odometer} miles</span>
						{item.hasKey ? (
							<span className='border border-brand-subtle text-green-600  text-xs font-medium px-1.5 py-0.5 rounded-sm'>keys</span>
						) : (
							<span className='border border-brand-subtle text-red-600  text-xs font-medium px-1.5 py-0.5 rounded-sm'>no keys</span>
						)}
						<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.year}</span>
					</div>
					<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.primaryDamage}</span>
					<div className='flex flex-row space-x-4'>
						<div className='flex flex-col'>
							<span className='text-[12px]'>Current Bid</span>
							<span className='text-xl font-extrabold text-heading'>${item.currentBid}</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-[12px]'>Buy it now</span>
							<span className='text-xl font-extrabold text-heading'>${item.buyItNow}</span>
						</div>
					</div>
					{/* <button
						type='button'
						className='inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none'>
						<svg className='w-4 h-4 me-1.5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
							<path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312'
							/>
						</svg>
						Add to cart
					</button> */}
				</div>
			</div>
		</div>
	);
}

export default Card;
