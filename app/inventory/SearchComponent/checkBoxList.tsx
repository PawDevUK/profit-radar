'use client';
import CollapseCard from '@/app/inventory/SearchComponent/collapseCard/collapseCard';
import SearchBar from '@/app/components/search/search';
import React, { useState, useCallback, useMemo, memo } from 'react';
import { filter_Results_State } from '@/lib/state/searchFilters.state';
import { selectSetFilter } from '@/lib/state/selectors/searchFilters.selectors';

type CheckboxListProps = {
	options: string[];
	selected?: string[] | string;
	title?: string;
	scrollable?: boolean;
	icon?: React.ReactNode;
	searchable?: boolean;
	multiSelect?: boolean;
};

function CheckBoxListComponent({ options, selected = [], title, scrollable, icon, searchable }: CheckboxListProps) {
	const [searchOptions, setSearchOptions] = useState<string[]>(options);
	const SET_Filter = filter_Results_State(selectSetFilter);
	const selectedSet = useMemo(() => {
		return Array.isArray(selected) ? new Set(selected) : new Set([selected]);
	}, [selected]);

	const handleSearchChange = useCallback(
		(query: string) => {
			const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
			setSearchOptions(filteredOptions);
			if (!query.trim()) {
				setSearchOptions(options);
			}
		},
		[options],
	);

	const handleCheckboxChange = useCallback(
		(option: string) => {
			SET_Filter(option, title ?? '');
		},
		[SET_Filter, title],
	);

	const resetOptions = useCallback(() => {
		setSearchOptions(options);
	}, [options]);

	return (
		<CollapseCard title={title || ''} resetOptions={resetOptions} icon={icon}>
			{searchable && <SearchBar handleOnChange={handleSearchChange} />}
			<div className={` ${scrollable ? 'max-h-64 overflow-y-auto' : ''}`}>
				{searchOptions.map((option) => (
					<Memo_CheckboxItem key={option} option={option} isSelected={selectedSet.has(option)} onChangeHandler={handleCheckboxChange} />
				))}
			</div>
		</CollapseCard>
	);
}

interface CheckboxItemProps {
	option: string;
	isSelected: boolean;
	onChangeHandler: (option: string) => void;
}

const Memo_CheckboxItem = memo(function CheckboxItem({ option, isSelected, onChangeHandler }: CheckboxItemProps) {
	return (
		<div className='flex flex-row mx-2 my-1'>
			<div className='inline-flex items-center'>
				<label className='flex items-center cursor-pointer relative'>
					<input
						type='checkbox'
						checked={isSelected}
						className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300'
						onChange={() => onChangeHandler(option)}
					/>
					<span className='absolute text-[var(--mongo-green)] opacity-0 peer-checked:opacity-100 top-[12px] left-[10px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-4.5 w-4.5' viewBox='0 0 20 20' fill='currentColor' stroke='currentColor' strokeWidth='1'>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
							/>
						</svg>
					</span>
					<div className='ml-2 mt-0.5 text-gray-500 text-[16px]'>{option}</div>
				</label>
			</div>
		</div>
	);
});

export default memo(CheckBoxListComponent);
