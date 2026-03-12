import { useState, useEffect } from 'react';
import CheckBoxList from './checkBoxList';
import { MapPin, Car, Gavel, Fuel, KeySquare, CarFront, ListTodo, ArrowDownUp } from 'lucide-react';
import './style.css';
import {
	sort,
	makes,
	titleType,
	conditionType,
	vehicleType,
	engineType,
	transmissionType,
	fuelType,
	driveTrain,
	cylinderType,
	auctionName,
	location,
	bodyType,
} from '@/app/inventory/options';

import { selectOne_State } from '@/lib/state/searchFilters';

import { Engine, Gears, VehicleType, CarCondition, DriveType, V8Icon, sizeIcons, strokeIcons, colorIcons } from './searchIcons';

interface SideSearchProps {
	filteredSaleResults: (cars: string[]) => void;
	resetAll: boolean;
}

export default function SideSearch({ filteredSaleResults, resetAll }: SideSearchProps) {
	const [selectedSort, setSelectedSort] = useState<string[]>([]);
	const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
	const [selectedModels, setSelectedModels] = useState<string[]>([]);
	const [selectedTitleType, setSelectedTitleType] = useState<string[]>([]);
	const [selectedConditionType, setSelectedConditionType] = useState<string[]>([]);
	const [selectedVehicleType, setSelectedVehicleType] = useState<string[]>([]);
	const [selectedEngineType, setSelectedEngineType] = useState<string[]>([]);
	const [selectedTransmissionType, setSelectedTransmissionType] = useState<string[]>([]);
	const [selectedFuelType, setSelectedFuelType] = useState<string[]>([]);
	const [selectedDriveTrain, setSelectedDriveTrain] = useState<string[]>([]);
	const [selectedCylinderType, setSelectedCylinderType] = useState<string[]>([]);
	const [selectedAuctionName, setSelectedAuctionName] = useState<string[]>([]);
	const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
	const [selectedBodyType, setSelectedBodyType] = useState<string[]>([]);

	const resetAllFilters = () => {
		setSelectedSort([]);
		setSelectedMakes([]);
		setSelectedModels([]);
		setSelectedTitleType([]);
		setSelectedConditionType([]);
		setSelectedVehicleType([]);
		setSelectedEngineType([]);
		setSelectedTransmissionType([]);
		setSelectedFuelType([]);
		setSelectedDriveTrain([]);
		setSelectedCylinderType([]);
		setSelectedAuctionName([]);
		setSelectedLocation([]);
		setSelectedBodyType([]);
	};

	const { selectedOneFilter } = selectOne_State();

	useEffect(() => {
		filteredSaleResults(selectedMakes);
	}, [selectedMakes]);

	useEffect(() => {
		if (resetAll) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			resetAllFilters();
		}
	}, [resetAll]);

	return (
		<div className='flex flex-col '>
			<CheckBoxList
				title='Sort'
				options={sort}
				selected={selectedOneFilter.Sort?.selected}
				onChange={setSelectedSort}
				icon={<ArrowDownUp strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				title='Make'
				options={makes}
				selected={selectedOneFilter.Make?.selected}
				onChange={setSelectedMakes}
				scrollable
				searchable
				icon={<CarFront strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			{/* <CheckBoxList
				multiSelect
				title='Model'
				options={makes}
				selected={selectedModels}
				onChange={setSelectedModels}
				scrollable
				searchable
				icon={<KeySquare strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				multiSelect
				title='Vehicle title type'
				options={titleType}
				selected={selectedTitleType}
				onChange={setSelectedTitleType}
				icon={<ListTodo strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				title='Vehicle condition type'
				options={conditionType}
				selected={selectedConditionType}
				onChange={setSelectedConditionType}
				icon={<CarCondition size={sizeIcons} color={colorIcons} />}
			/>
			<CheckBoxList
				multiSelect
				title='Vehicle type'
				options={vehicleType}
				selected={selectedVehicleType}
				onChange={setSelectedVehicleType}
				scrollable
				searchable
				icon={<VehicleType size={sizeIcons} color={colorIcons} />}
			/>
			<CheckBoxList multiSelect title='Engine type' options={engineType} selected={selectedEngineType} onChange={setSelectedEngineType} icon={<Engine />} />
			<CheckBoxList multiSelect title='Transmission' options={transmissionType} selected={selectedTransmissionType} onChange={setSelectedTransmissionType} icon={<Gears />} />
			<CheckBoxList
				multiSelect
				title='Fuel type'
				options={fuelType}
				selected={selectedFuelType}
				onChange={setSelectedFuelType}
				icon={<Fuel strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				multiSelect
				title='Drive train'
				options={driveTrain}
				selected={selectedDriveTrain}
				onChange={setSelectedDriveTrain}
				icon={<DriveType size={sizeIcons} color={colorIcons} />}
			/>
			<CheckBoxList
				multiSelect
				title='Cylinder'
				options={cylinderType}
				selected={selectedCylinderType}
				onChange={setSelectedCylinderType}
				icon={<V8Icon size={sizeIcons} color={colorIcons} />}
			/>
			<CheckBoxList
				multiSelect
				title='Auction name'
				options={auctionName}
				selected={selectedAuctionName}
				onChange={setSelectedAuctionName}
				icon={<Gavel strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				multiSelect
				title='Location'
				options={location}
				selected={selectedLocation}
				onChange={setSelectedLocation}
				scrollable
				icon={<MapPin strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				multiSelect
				title='Body style'
				options={bodyType}
				selected={selectedBodyType}
				onChange={setSelectedBodyType}
				icon={<Car strokeWidth={strokeIcons} className='checkboxIcon' />}
			/> */}
		</div>
	);
}
