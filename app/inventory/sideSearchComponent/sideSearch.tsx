import { useState, useEffect } from 'react';
import CollapseCard from '@/app/components/common/collapseCard/collapseCard';
import CheckBoxList from './search/checkBoxList';

import Toggler from '@/app/components/common/toggler/toggler';

interface SideSearchProps {
	saleResults: string[];
	filteredSaleResults: (cars: string[]) => void; // Updated type to match CheckBoxList
}

export default function SideSearch({ saleResults, filteredSaleResults }: SideSearchProps) {
	const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
	const [selectedModels, setSelectedModels] = useState<string[]>([]);
	const [selectedTitleType, setSelectedTitleType] = useState<string[]>([]);
	const [selectedConditionType, setSelectedConditionType] = useState<string[]>([]);

	useEffect(() => {
		filteredSaleResults(selectedMakes);
	}, [selectedMakes]);

	return (
		<div className='flex flex-col min-h-screen '>
			<CheckBoxList title='Make' options={saleResults} selected={selectedMakes} onChange={setSelectedMakes} scrollable />
			<CheckBoxList title='Model' options={saleResults} selected={selectedModels} onChange={setSelectedModels} scrollable />
			<CheckBoxList title='Vehicle title type' options={saleResults} selected={selectedTitleType} onChange={setSelectedTitleType}></CheckBoxList>
			<CheckBoxList title='Vehicle condition type' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Search near ZIP code' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Vehicle type' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Engine type' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Transmission' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Fuel type' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Drive train' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Cylinder' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Auction name' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Location' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Body style' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
			<CheckBoxList title='Sale date' options={saleResults} selected={selectedConditionType} onChange={setSelectedConditionType}></CheckBoxList>
		</div>
	);
}
