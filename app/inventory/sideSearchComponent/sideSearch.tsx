import { useState, useEffect } from 'react';
import CheckBoxList from './search/checkBoxList';
import {
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
} from '@/app/inventory/samples';

import Toggler from '@/app/components/common/toggler/toggler';

interface SideSearchProps {
	filteredSaleResults: (cars: string[]) => void; // Updated type to match CheckBoxList
}

export default function SideSearch({ filteredSaleResults }: SideSearchProps) {
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

	useEffect(() => {
		filteredSaleResults(selectedMakes);
	}, [selectedMakes]);

	return (
		<div className='flex flex-col min-h-screen '>
			<CheckBoxList title='Make' options={makes} selected={selectedMakes} onChange={setSelectedMakes} scrollable />
			<CheckBoxList title='Model' options={makes} selected={selectedModels} onChange={setSelectedModels} scrollable />
			<CheckBoxList title='Vehicle title type' options={titleType} selected={selectedTitleType} onChange={setSelectedTitleType} />
			<CheckBoxList title='Vehicle condition type' options={conditionType} selected={selectedConditionType} onChange={setSelectedConditionType} />
			<CheckBoxList title='Vehicle type' options={vehicleType} selected={selectedVehicleType} onChange={setSelectedVehicleType} scrollable />
			<CheckBoxList title='Engine type' options={engineType} selected={selectedEngineType} onChange={setSelectedEngineType} />
			<CheckBoxList title='Transmission' options={transmissionType} selected={selectedTransmissionType} onChange={setSelectedTransmissionType} />
			<CheckBoxList title='Fuel type' options={fuelType} selected={selectedFuelType} onChange={setSelectedFuelType} />
			<CheckBoxList title='Drive train' options={driveTrain} selected={selectedDriveTrain} onChange={setSelectedDriveTrain} />
			<CheckBoxList title='Cylinder' options={cylinderType} selected={selectedCylinderType} onChange={setSelectedCylinderType} />
			<CheckBoxList title='Auction name' options={auctionName} selected={selectedAuctionName} onChange={setSelectedAuctionName} />
			<CheckBoxList title='Location' options={location} selected={selectedLocation} onChange={setSelectedLocation} scrollable />
			<CheckBoxList title='Body style' options={bodyType} selected={selectedBodyType} onChange={setSelectedBodyType} />
		</div>
	);
}
