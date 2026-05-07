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

import { setFilterResults_State } from '@/lib/state/searchFilters.state';
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

interface makeModelType {
	make: string;
	models: string[];
}

function getMakes(makes: makeModelType[]) {
	const makesArr = makes.map((make: makeModelType) => {
		return make.make;
	});
	return makesArr;
}
function getModels(make: string) {
	return makes.filter((prop) => make === prop.make)[0]?.models || [];
}
export default function SideSearch() {
	const sortFilter = setFilterResults_State(selectSearchFilterByKey('sort'));
	const makeFilter = setFilterResults_State(selectSearchFilterByKey('make'));
	const selectedModelsFilter = setFilterResults_State(selectSearchFilterByKey('selectedModels'));
	const vehicleTitleTypeFilter = setFilterResults_State(selectSearchFilterByKey('vehicleTitleType'));
	const vehicleConditionTypeFilter = setFilterResults_State(selectSearchFilterByKey('vehicleConditionType'));
	const vehicleTypeFilter = setFilterResults_State(selectSearchFilterByKey('vehicleType'));
	const engineTypeFilter = setFilterResults_State(selectSearchFilterByKey('engineType'));
	const transmissionFilter = setFilterResults_State(selectSearchFilterByKey('transmission'));
	const fuelTypeFilter = setFilterResults_State(selectSearchFilterByKey('fuelType'));
	const driveTrainFilter = setFilterResults_State(selectSearchFilterByKey('driveTrain'));
	const cylindersFilter = setFilterResults_State(selectSearchFilterByKey('cylinders'));
	const auctionNameFilter = setFilterResults_State(selectSearchFilterByKey('auctionName'));
	const locationFilter = setFilterResults_State(selectSearchFilterByKey('location'));
	const bodyStyleFilter = setFilterResults_State(selectSearchFilterByKey('bodyStyle'));

	return (
		<div className='flex flex-col '>
			<CheckBoxList title='Sort' options={sort} selected={sortFilter} icon={sortIcon} />
			<CheckBoxList title='Make' options={getMakes(makes)} selected={makeFilter} scrollable searchable icon={makeIcon} makesData={makes} />
			<CheckBoxList multiSelect title='Model' options={getModels(makeFilter)} selected={selectedModelsFilter} scrollable searchable icon={modelIcon} />
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
