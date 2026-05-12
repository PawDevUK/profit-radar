import CheckBoxList from './checkBoxList';
import { useAllCarsStore } from '@/lib/state/allCars.state';

import { MapPin, Car, Gavel, Fuel, KeySquare, CarFront, ListTodo, ArrowDownUp } from 'lucide-react';
import './style.css';
import { useEffect, useState } from 'react';
import {
	sort,
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

import { useFilterResultsStore } from '@/lib/state/searchFilters.state';
import { selectSearchFilterByKey } from '@/lib/state/selectors/searchFilters.selectors';

import { Engine, Gears, VehicleType, CarCondition, DriveType, V8Icon, strokeIcons, colorIcons } from './searchIcons';

const engineTypeIcon = <Engine />;
const transmissionIcon = <Gears />;
const driveTrainIcon = <DriveType />;
const cylindersIcon = <V8Icon />;
const vehicleConditionIcon = <CarCondition />;
const vehicleTypeIcon = <VehicleType />;

const sortIcon = <ArrowDownUp strokeWidth={strokeIcons} className='checkboxIcon' />;
const makeIcon = <CarFront strokeWidth={strokeIcons} className='checkboxIcon' />;
const modelIcon = <KeySquare strokeWidth={strokeIcons} className='checkboxIcon' />;
const titleTypeIcon = <ListTodo strokeWidth={strokeIcons} className='checkboxIcon' />;
const fuelTypeIcon = <Fuel strokeWidth={strokeIcons} className='checkboxIcon' />;
const auctionNameIcon = <Gavel strokeWidth={strokeIcons} className='checkboxIcon' />;
const locationIcon = <MapPin strokeWidth={strokeIcons} className='checkboxIcon' />;
const bodyStyleIcon = <Car strokeWidth={strokeIcons} className='checkboxIcon' />;

export default function SideSearch() {
	const cars = useAllCarsStore((state) => state.allCars);
	const [makes, setMakes] = useState<string[]>([]);
	const [models, setModels] = useState<string[]>([]);

	const sortFilter = useFilterResultsStore(selectSearchFilterByKey('sort'));
	const makeFilter = useFilterResultsStore(selectSearchFilterByKey('make'));
	const selectedModelsFilter = useFilterResultsStore(selectSearchFilterByKey('selectedModels'));
	const vehicleTitleTypeFilter = useFilterResultsStore(selectSearchFilterByKey('vehicleTitleType'));
	const vehicleConditionTypeFilter = useFilterResultsStore(selectSearchFilterByKey('vehicleConditionType'));
	const vehicleTypeFilter = useFilterResultsStore(selectSearchFilterByKey('vehicleType'));
	const engineTypeFilter = useFilterResultsStore(selectSearchFilterByKey('engineType'));
	const transmissionFilter = useFilterResultsStore(selectSearchFilterByKey('transmission'));
	const fuelTypeFilter = useFilterResultsStore(selectSearchFilterByKey('fuelType'));
	const driveTrainFilter = useFilterResultsStore(selectSearchFilterByKey('driveTrain'));
	const cylindersFilter = useFilterResultsStore(selectSearchFilterByKey('cylinders'));
	const auctionNameFilter = useFilterResultsStore(selectSearchFilterByKey('auctionName'));
	const locationFilter = useFilterResultsStore(selectSearchFilterByKey('location'));
	const bodyStyleFilter = useFilterResultsStore(selectSearchFilterByKey('bodyStyle'));

	function getStateModels(make: string) {
		const selectedModels: string[] = [];
		cars.forEach((car) => {
			if (car.make === make && car.model) {
				selectedModels.push(car.model);
			}
		});
		return [...new Set(selectedModels.map((model) => model))].sort();
	}

	useEffect(() => {
		const makes: string[] = [...new Set(cars.map((car) => (car.make ? car.make : '')))].sort();
		setMakes(makes);
	}, []);

	useEffect(() => {
		const selectedModels = getStateModels(makeFilter);
		setModels(selectedModels);
	}, [makeFilter]);

	return (
		<div className='flex flex-col '>
			<CheckBoxList title='Sort' options={sort} selected={sortFilter} icon={sortIcon} />
			<CheckBoxList title='Make' options={makes} selected={makeFilter} scrollable searchable icon={makeIcon} />
			{models.length > 0 ? <CheckBoxList multiSelect title='Model' options={models} selected={selectedModelsFilter} scrollable searchable icon={modelIcon} /> : ''}
			<CheckBoxList multiSelect title='Vehicle title type' options={titleType} selected={vehicleTitleTypeFilter} icon={titleTypeIcon} />
			<CheckBoxList multiSelect title='Body style' options={bodyType} selected={bodyStyleFilter} icon={bodyStyleIcon} />
			<CheckBoxList title='Vehicle condition type' options={conditionType} selected={vehicleConditionTypeFilter} icon={vehicleConditionIcon} />
			<CheckBoxList multiSelect title='Vehicle type' options={vehicleType} selected={vehicleTypeFilter} scrollable searchable icon={vehicleTypeIcon} />
			<CheckBoxList multiSelect title='Engine type' options={engineType} selected={engineTypeFilter} icon={engineTypeIcon} />
			<CheckBoxList multiSelect title='Transmission' options={transmissionType} selected={transmissionFilter} icon={transmissionIcon} />
			<CheckBoxList multiSelect title='Fuel type' options={fuelType} selected={fuelTypeFilter} icon={fuelTypeIcon} />
			<CheckBoxList multiSelect title='Drive train' options={driveTrain} selected={driveTrainFilter} icon={driveTrainIcon} />
			<CheckBoxList multiSelect title='Cylinders' options={cylinderType} selected={cylindersFilter} icon={cylindersIcon} />
			<CheckBoxList multiSelect title='Auction name' options={auctionName} selected={auctionNameFilter} icon={auctionNameIcon} />
			<CheckBoxList multiSelect title='Location' options={location} selected={locationFilter} scrollable icon={locationIcon} />
		</div>
	);
}
