'use client';
import React, { useEffect, useRef, useState } from 'react';
import './style.css';

export default function CollapseCard({ children, title, resetOptions }: { children: React.ReactNode; title: string; resetOptions?: () => void }) {
	const [open, setOpen] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const [contentHeight, setContentHeight] = useState(0);

	useEffect(() => {
		if (contentRef.current) {
			setContentHeight(contentRef.current.scrollHeight);
		}
	}, [children, open]);

	return (
		<div className='z-20 bg-white borderBottom'>
			<button className='absolute right-15 top-2 resetButton' onClick={resetOptions}>
				Reset
			</button>
			<button className='w-full flex items-center justify-between px-5 py-2 font-semibold text-black focus:outline-none' onClick={() => setOpen((v) => !v)}>
				<span className='header'>{title}</span>
				<svg
					className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
					width='23'
					height='23'
					fill='none'
					stroke='currentColor'
					strokeWidth='1'
					strokeLinecap='round'
					strokeLinejoin='round'
					viewBox='0 0 24 24'>
					<polyline points='6 9 12 15 18 9' />
				</svg>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100' : 'opacity-0'}`}
				style={{ maxHeight: open ? `${contentHeight}px` : '0px' }}>
				<div ref={contentRef} className='px-4 pb-4 text-sm'>
					{children}
				</div>
			</div>
		</div>
	);
}
