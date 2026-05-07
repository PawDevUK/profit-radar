'use client';
import Image from 'next/image';
import { carImagePlaceholder } from '@/img';

function Card({ ...props }) {
	const { item, onClick } = props;
	const { images } = item;

	const imageUrl = images.copart ? images.copart[0] : carImagePlaceholder;
	return (
		<div
			className='md:max-h-115.5 w-full max-w-lg md:w-[30%] lg:w-[22%] xl:w-[18%] m-1.5 bg-neutral-primary-soft border border-gray-300 rounded-base shadow-md rounded-lg flex flex-row md:flex-col'
			onClick={onClick}>
			<div className='flex flex-col justify-between md:w-full w-40 relative h-full md:h-40 '>
				<a href='#' className='w-full h-full '>
					<span className='absolute top-1 left-1 z-5 border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm bg-white'>
						{item.lotInv}
					</span>
					<Image
						className='absolute top-0 left-0 z-1 rounded-base rounded-bl-lg rounded-tl-lg md:rounded-bl-none md:rounded-tr-lg h-full w-full object-cover object-left'
						src={imageUrl}
						alt='lot image'
						width={300}
						height={300}
					/>
				</a>
			</div>

			<div className='p-2 flex flex-col justify-between flex-1 md:w-full w-1/2'>
				<div className='flex flex-col'>
					<a className='flex flex-row justify-center' href='#'>
						<h5 className='text-[16px] text-heading font-semibold tracking-tight'>{item.title ? item.title.slice(0, 20) : ''}</h5>
					</a>
				</div>
				<div className='flex flex-col items-center mt-1 '>
					<div className='flex flex-col'>
						<div className=' flex flex-row items-center space-x-1 mb-1'>
							<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.odometer} miles</span>
							<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 rounded-sm'>{item.year}</span>
						</div>
						<span className='border border-brand-subtle text-(--main-blue)  text-xs font-medium px-1.5 py-0.5 m-auto rounded-sm'>{item.damageDescription}</span>
					</div>

					<div className='flex flex-row space-x-4 mt-1'>
						<div className='flex flex-col'>
							<span className='text-[12px]'>Current Bid</span>
							<span className='text-lg font-extrabold text-heading'>${item.currentBid}</span>
						</div>
						<div className='flex flex-col'>
							<span className='text-[12px]'>Buy it now</span>
							<span className='text-lg font-extrabold text-heading'>${item.buyItNow ? item.buyItNow : '0'}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Card;
