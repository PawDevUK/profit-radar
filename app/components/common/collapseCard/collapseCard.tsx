'use client';
import React, { useState } from 'react';
import './style.css';

export default function CollapseCard({ children, title }: { children: React.ReactNode; title: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className='z-20 bg-white borderBottom'>
			<button className='w-full flex items-center justify-between px-4 py-3 font-semibold text-black focus:outline-none' onClick={() => setOpen((v) => !v)}>
				<span className='header'>{title}</span>
				<svg
					className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
					width='20'
					height='20'
					fill='none'
					stroke='currentColor'
					strokeWidth='1'
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
