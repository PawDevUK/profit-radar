'use client';
import CollapseCard from '@/app/inventory/SearchComponent/collapseCard/collapseCard';
import SearchBar from '@/app/components/search/search';
import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { FilterResults_State, makesType } from '@/lib/state/searchFilters.state';
import { selectSetFilter } from '@/lib/state/selectors/searchFilters.selectors';

type CheckboxListProps = {
	options: string[];
	selected?: string[] | string;
	title?: string;
	scrollable?: boolean;
	icon?: React.ReactNode;
	searchable?: boolean;
	multiSelect?: boolean;
	setMake?: React.Dispatch<React.SetStateAction<string>>;
};

function CheckBoxListComponent({ options, selected = [], title, scrollable, icon, searchable, setMake }: CheckboxListProps) {
	const [searchOptions, setSearchOptions] = useState<string[]>(options);
	const SET_Filter = FilterResults_State(selectSetFilter);
	const selectedSet = useMemo(() => {
		return Array.isArray(selected) ? new Set(selected) : new Set([selected]);
	}, [selected]);

	useEffect(() => {
		setSearchOptions(options);
	}, [options]);

	const handleSearchChange = useCallback(
		(query: string | undefined) => {
			if (!query) {
				setSearchOptions(options);
				return;
			}
			const filteredOptions = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));
			setSearchOptions(filteredOptions);
		},
		[options],
	);

	const handleCheckboxChange = useCallback(
		(option: string) => {
			SET_Filter(option, title ?? '');
		},
		[SET_Filter, title],
	);

	return (
		<CollapseCard title={title || ''} icon={icon}>
			{searchable && (
				<div className='flex flex-row justify-center md:justify-start md:ml-8 mb-2'>
					<div className='w-70'>
						<SearchBar placeholderText={`Search ${title || ''}...`} handleOnChange={handleSearchChange} />
					</div>
				</div>
			)}
			<div className={`px-4 ${scrollable ? 'max-h-64 overflow-y-auto' : ''}`}>
				{searchOptions.map((option) => (
					<Memo_CheckboxItem key={option} option={option} isSelected={selectedSet.has(option)} onChangeHandler={handleCheckboxChange} setMake={setMake} />
				))}
			</div>
		</CollapseCard>
	);
}

interface CheckboxItemProps {
	option: string;
	isSelected: boolean;
	onChangeHandler: (option: string) => void;
	setMake?: React.Dispatch<React.SetStateAction<string>>;
}

const Memo_CheckboxItem = memo(function CheckboxItem({ option, isSelected, onChangeHandler, setMake }: CheckboxItemProps) {
	useEffect(() => {
		if (isSelected && setMake) {
			setMake(option);
		}
	}, [isSelected]);
	return (
		<div className='flex flex-row mx-2 my-1'>
			<div className='inline-flex items-center'>
				<label className='flex items-center cursor-pointer relative'>
					<input
						type='checkbox'
						checked={isSelected}
						className='peer h-6 w-6 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300'
						onChange={() => onChangeHandler(option)}
					/>
					<span className='absolute text-[var(--mongo-green)] opacity-0 peer-checked:opacity-100 top-[13px] left-[12px] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-5.5 w-5.5' viewBox='0 0 20 20' fill='currentColor' stroke='currentColor' strokeWidth='1'>
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
