'use client';
import CollapseCard from '@/app/components/common/collapseCard/collapseCard';
import SearchBar from '@/app/components/search/search';
import { useState } from 'react';

// Reusable CheckboxList component
type CheckboxListProps = {
	options: string[];
	selected: string[];
	onChange: (cars: string[]) => void;
	title?: string;
	scrollable?: boolean;
};

export default function CheckBoxList({ options, selected, onChange, title, scrollable }: CheckboxListProps) {
	const [searchOptions, setSearchOptions] = useState<string[]>(options);

	const handleChange = (option: string) => {
		if (selected.includes(option)) {
			onChange(selected.filter((o) => o !== option));
		} else {
			onChange([...selected, option]);
		}
	};
	const handleSearchChange = (query: string) => {
		// Implement search logic here, e.g., filter options based on the query
		const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
		setSearchOptions(filteredOptions);
		if (!query.trim()) {
			setSearchOptions(options);
		}
	};

	return (
		<CollapseCard title={title || ''} scrollable={scrollable}>
			<SearchBar handleOnChange={handleSearchChange} />
			{searchOptions.map((option) => (
				<div key={option} className='flex flex-row mx-1'>
					<div className='inline-flex items-center'>
						<label className='flex items-center cursor-pointer relative'>
							<input
								type='checkbox'
								checked={selected.includes(option)}
								className='peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 '
								onChange={() => handleChange(option)}
							/>
							<span className='absolute text-[var(--mongo-green)] opacity-0 peer-checked:opacity-100 top-[11px] left-[8px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-3.5 w-3.5' viewBox='0 0 20 20' fill='currentColor' stroke='currentColor' strokeWidth='1'>
									<path
										fillRule='evenodd'
										d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							</span>
							<div className='ml-2 mt-0.5 text-gray-500'>{option}</div>
						</label>
					</div>
				</div>
			))}
		</CollapseCard>
	);
}
