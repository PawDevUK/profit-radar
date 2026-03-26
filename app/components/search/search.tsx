'use client';

import { useState, FormEvent, useId } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface searchBarTypes {
	handleOnChange?: (query: string | undefined) => void;
	placeholderText?: string;
	options?: string[];
	targetRoute?: string;
	locationListSelected?: string;
	componentType?: 'searchBar' | 'locationList';
}

export default function SearchBar({ handleOnChange, placeholderText, targetRoute, options, locationListSelected, componentType }: searchBarTypes) {
	const [query, setQuery] = useState('');
	const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
	const router = useRouter();
	const datalistId = useId();
	const [selectedOptionPlaceholder, setSelectedOptionPlaceholder] = useState('');
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim()) return;

		if (targetRoute) {
			router.push(`/${targetRoute}`);
		}
		setQuery('');
	};

	return (
		<form onSubmit={handleSubmit} className='pointer-events-auto mx-auto flex w-full max-w-lg items-center gap-2 sm:gap-3 px-1 '>
			{/* Input wrapper */}
			<div className='group relative w-full'>
				{/* Input */}
				<input
					type='text'
					id='voice-search'
					value={query}
					list={options?.length ? datalistId : undefined}
					autoComplete='off'
					onChange={(e) => {
						const value = e.target.value;
						setQuery(value);
						handleOnChange?.(value);
						setSelectedOptionPlaceholder(value);
						if (options && options.includes(value)) {
							setQuery('');
						}
					}}
					className={`
						${handleOnChange ? 'h-7.5 mb-1.25' : ''}
						${componentType === 'locationList' ? 'h-9' : ''}
						
						bg-frosted-glass
			block w-full rounded-lg border border-gray-300 bg-white/80 
			pl-3 pr-10 py-2.5 text-sm text-gray-900 
			placeholder:text-gray-500 
			focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
			shadow-sm transition-all outline-none
			group-focus-within:shadow-md
          `}
					placeholder={selectedOptionPlaceholder || locationListSelected || placeholderText}
					required
				/>

				{options ? (
					<button type='button' className='absolute right-4 top-1.75 w-1/8' onClick={() => setOptionsDropdownOpen((prev) => !prev)}>
						{optionsDropdownOpen ? <ChevronUp /> : <ChevronDown />}
					</button>
				) : null}

				{optionsDropdownOpen && options?.length ? (
					<ul className='absolute right-0 top-full mt-1 w-max max-h-60 overflow-auto rounded-md  bg-frosted-glass shadow-lg z-10'>
						<div className='hover:bg-gray-100 h-10 pt-2 pl-4.25 pb-2'>
							<button
								className='w-full h-full flex flex-row justify-start'
								onClick={() => {
									setQuery('');
									handleOnChange?.(undefined);
									setSelectedOptionPlaceholder('');
									setOptionsDropdownOpen(false);
								}}>
								All LOCATIONS
							</button>
						</div>

						{options.map((option) => (
							<li
								key={option}
								className='cursor-pointer px-4 py-2 hover:bg-gray-100'
								onClick={() => {
									setQuery(option);
									handleOnChange?.(option);
									setSelectedOptionPlaceholder(option);
									setOptionsDropdownOpen(false);
								}}>
								{option}
							</li>
						))}
					</ul>
				) : null}
			</div>

			{/* Submit button */}
			{!handleOnChange ? (
				<button type='submit' className='button-blue'>
					<svg className='h-4 w-4 mr-1' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
						<path stroke='currentColor' strokeLinecap='round' strokeWidth='2' d='m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z' />
					</svg>
					Search
				</button>
			) : null}
		</form>
	);
}
