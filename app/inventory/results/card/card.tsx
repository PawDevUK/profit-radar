'use client';
import { expand } from 'img';
import Button from 'components/common/Button';
import React, { useEffect, useState } from 'react';
import { cardTextLength } from 'factory/factory';
import Stack from './Stack';
import Header from '../common/Header';

function Card({ ...props }) {
	const [textLength, setTextLength] = useState(0);
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		window.addEventListener('resize', () => setWidth(window.innerWidth));
		setTextLength(cardTextLength(width));
	}, [width]);

	return (
		<div className='group relative z-[1000] mt-10 mr-0 md:mr-10 mx-auto md:mx-0 w-[90%] sm:w-[65%] lg:w-[42%] lg:even:mr-0 flex flex-col items-end bg-white border border-[#dbdbdb] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'>
			<img src={props.item.src} alt={props.item.alt} className='block w-full h-full rounded-t-[20px]' />
			{width >= 650 ? <Stack stack={props.stack}></Stack> : null}

			<div className='relative w-full flex mx-auto'>
				<div className='w-full text-center'>
					<Header>
						{props.item.title}
						<div className='absolute h-px w-full opacity-0 group-hover:opacity-100 bg-[#172a3f96] rounded-[5px] left-0 bottom-[-1px] transition-opacity duration-300' />
					</Header>
				</div>
			</div>

			<div className='z-[10000] text-center mx-5 mb-[5px]'>
				<p className='text-base' style={{ lineHeight: `${props.p_line_height}px` }}>
					{props.item.text}
				</p>
			</div>

			<div className='flex justify-between sm:justify-between w-[80%] sm:w-[300px] mx-auto mb-[10px]'>
				<a
					href={props.item.webHref.href}
					target='_blank'
					className={`block m-[5px] sm:m-[10px] hover:no-underline ${!props.item.webHref.href ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>
					<Button light>{props.item.webHref.button}</Button>
				</a>
				<a href={props.item.githubHref} target='_blank' className='block m-[5px] sm:m-[10px] hover:no-underline'>
					<Button light>Github Repo</Button>
				</a>
			</div>
		</div>
	);
}

export default Card;
