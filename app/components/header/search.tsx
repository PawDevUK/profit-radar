// components/SearchBar.tsx
'use client';

import { useState, FormEvent } from 'react';

export default function SearchBar() {
	const [query, setQuery] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim()) return;
		console.log('Searching for:', query);
		// alert(`Searching for: ${query}`); // for quick testing

		// Optional: clear input after submit
		// setQuery('');
	};

	return (
		<form onSubmit={handleSubmit} className='mx-auto flex w-full max-w-lg items-center gap-2 sm:gap-3'>
			{/* Input wrapper */}
			<div className='group relative w-full'>
				{/* Input */}
				<input
					type='text'
					id='voice-search'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className={`
            block w-full rounded-lg border border-gray-300 bg-white/80 
            pl-9 pr-10 py-2.5 text-sm text-gray-900 
            placeholder:text-gray-500 
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
            shadow-sm transition-all outline-none
            group-focus-within:shadow-md
          `}
					placeholder='Enter Make, Model, Damage, Color, VIN, and more...'
					required
				/>
			</div>

			{/* Submit button */}
			<button
				type='submit'
				className={`
          inline-flex items-center gap-1.5 rounded-lg 
          bg-blue-600 px-5 py-2.5 text-sm font-medium text-white 
          shadow-sm hover:bg-blue-700 active:bg-blue-800 
          focus:ring-4 focus:ring-blue-300 focus:outline-none 
          transition-all whitespace-nowrap
        `}>
				<svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
					<path stroke='currentColor' strokeLinecap='round' strokeWidth='2' d='m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z' />
				</svg>
				Search
			</button>
		</form>
	);
}
