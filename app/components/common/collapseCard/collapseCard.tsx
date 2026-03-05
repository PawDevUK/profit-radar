'use client';
import React, { useState } from 'react';
import './style.css';

export default function CollapseCard({ children, title, resetOptions, icon }: { children: React.ReactNode; title: string; resetOptions?: () => void; icon?: React.ReactNode }) {
	const [open, setOpen] = useState(false);

	return (
		<div className='z-20 bg-white borderBottom'>
			<button className='absolute right-15 top-2 resetButton' onClick={resetOptions}>
				Reset
			</button>
			<button className='w-full flex items-center justify-between px-5 py-2 font-semibold text-black focus:outline-none' onClick={() => setOpen((prev) => !prev)}>
				<div className='flex flex-row'>
					{icon && <span className='icon'>{icon}</span>}
					<span className='header ml-2'>{title}</span>
				</div>
				<svg
					id='chevron'
					className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
					width='23'
					height='23'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					viewBox='0 0 24 24'>
					<polyline points='6 9 12 15 18 9' />
				</svg>
			</button>
			{open && <div className='px-4 pb-4 text-sm'>{children}</div>}
		</div>
	);
}
