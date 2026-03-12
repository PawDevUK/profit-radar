'use client';
import CollapseCard from '@/app/inventory/SearchComponent/collapseCard/collapseCard';
import SearchBar from '@/app/components/search/search';
import { useEffect, useState } from 'react';
import { selectOne_State } from '@/lib/state/searchFilters';

// Reusable CheckboxList component
type CheckboxListProps = {
	options: string[];
	selected?: string[] | string;
	onChange: (cars: string[]) => void;
	title?: string;
	scrollable?: boolean;
	icon?: React.ReactNode;
	searchable?: boolean;
	multiSelect?: boolean;
};

export default function CheckBoxList({ options, selected = [], onChange, title, scrollable, icon, searchable, multiSelect }: CheckboxListProps) {
	const [searchOptions, setSearchOptions] = useState<string[]>(options);
	const { SETselectOneFilter } = selectOne_State();

	const handleChange = (option: string) => {
		if (multiSelect) {
			if (selected.includes(option)) {
				onChange(Array.isArray(selected) ? selected.filter((o) => o !== option) : []);
			} else {
				onChange([...selected, option]);
			}
		} else {
			if (selected.includes(option)) {
				onChange([]);
				SETselectOneFilter('', title || '');
			} else {
				onChange([option]);
				SETselectOneFilter(option, title || '');
			}
		}
	};

	const handleSearchChange = (query: string) => {
		const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
		setSearchOptions(filteredOptions);
		if (!query.trim()) {
			setSearchOptions(options);
		}
	};
	const resetOptions = () => {
		onChange([]);
		setSearchOptions(options);
	};

	return (
		<CollapseCard title={title || ''} resetOptions={resetOptions} icon={icon}>
			{searchable && <SearchBar handleOnChange={handleSearchChange} />}
			<div className={` ${scrollable ? 'max-h-64 overflow-y-auto' : ''}`}>
				{options.map((option) => (
					<div key={option} className='flex flex-row mx-2 my-1'>
						<div className='inline-flex items-center'>
							<label className='flex items-center cursor-pointer relative'>
								<input
									type='checkbox'
									checked={selected.includes(option)}
									className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 '
									onChange={() => handleChange(option)}
								/>
								<span className='absolute text-[var(--mongo-green)] opacity-0 peer-checked:opacity-100 top-[12px] left-[10px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
									<svg xmlns='http://www.w3.org/2000/svg' className='h-4.5 w-4.5' viewBox='0 0 20 20' fill='currentColor' stroke='currentColor' strokeWidth='1'>
										<path
											fillRule='evenodd'
											d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
											clipRule='evenodd'
										/>
									</svg>
								</span>
								<div className='ml-2 mt-0.5 text-gray-500 text-[16px]'>{option}</div>
							</label>
						</div>
					</div>
				))}
			</div>
		</CollapseCard>
	);
}
