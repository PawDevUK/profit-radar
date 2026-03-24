'use client';

import { useState, FormEvent, useId } from 'react';
import { useRouter } from 'next/navigation';

interface searchBarTypes {
	handleOnChange?: (query: string) => void;
	placeholderText?: string;
	options?: string[];
	targetRoute?: string;
}

export default function SearchBar({ handleOnChange, placeholderText, targetRoute, options }: searchBarTypes) {
	const [query, setQuery] = useState('');
	const router = useRouter();
	const datalistId = useId();
	const [selectedOptionPlaceholder, setSelectedOptionPlaceholder] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim()) return;

		if (targetRoute) {
			router.push(`/${targetRoute}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='mx-auto flex w-full max-w-lg items-center gap-2 sm:gap-3 px-1'>
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
						handleOnChange?.(value);
						setSelectedOptionPlaceholder(value);
					}}
					className={`
						${handleOnChange ? 'h-7.5 mb-1.25' : ''}
			block w-full rounded-lg border border-gray-300 bg-white/80 
			pl-3 pr-10 py-2.5 text-sm text-gray-900 
			placeholder:text-gray-500 
			focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
			shadow-sm transition-all outline-none
			group-focus-within:shadow-md
          `}
					placeholder={selectedOptionPlaceholder ? selectedOptionPlaceholder : placeholderText}
					required
				/>

				{options?.length ? (
					<datalist id={datalistId}>
						{options.map((option) => (
							<option key={option} value={option} />
						))}
					</datalist>
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
