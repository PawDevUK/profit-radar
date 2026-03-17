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

import { filter_Results_State } from '@/lib/state/searchFilters.state';
import { selectSearchFilterByKey } from '@/lib/state/selectors/searchFilters.selectors';

import { Engine, Gears, VehicleType, CarCondition, DriveType, V8Icon, sizeIcons, strokeIcons, colorIcons } from './searchIcons';

const sortIcon = <ArrowDownUp strokeWidth={strokeIcons} className='checkboxIcon' />;
const makeIcon = <CarFront strokeWidth={strokeIcons} className='checkboxIcon' />;
const modelIcon = <KeySquare strokeWidth={strokeIcons} className='checkboxIcon' />;
const titleTypeIcon = <ListTodo strokeWidth={strokeIcons} className='checkboxIcon' />;
const vehicleConditionIcon = <CarCondition size={sizeIcons} color={colorIcons} />;
const vehicleTypeIcon = <VehicleType size={sizeIcons} color={colorIcons} />;
const engineTypeIcon = <Engine />;
const transmissionIcon = <Gears />;
const fuelTypeIcon = <Fuel strokeWidth={strokeIcons} className='checkboxIcon' />;
const driveTrainIcon = <DriveType size={sizeIcons} color={colorIcons} />;
const cylindersIcon = <V8Icon size={sizeIcons} color={colorIcons} />;
const auctionNameIcon = <Gavel strokeWidth={strokeIcons} className='checkboxIcon' />;
const locationIcon = <MapPin strokeWidth={strokeIcons} className='checkboxIcon' />;
const bodyStyleIcon = <Car strokeWidth={strokeIcons} className='checkboxIcon' />;

interface SideSearchProps {
	resetAll: boolean;
}

export default function SideSearch({ resetAll }: SideSearchProps) {
	void resetAll;
	const sortFilter = filter_Results_State(selectSearchFilterByKey('sort'));
	const makeFilter = filter_Results_State(selectSearchFilterByKey('make'));
	const modelFilter = filter_Results_State(selectSearchFilterByKey('model'));
	const vehicleTitleTypeFilter = filter_Results_State(selectSearchFilterByKey('vehicleTitleType'));
	const vehicleConditionTypeFilter = filter_Results_State(selectSearchFilterByKey('vehicleConditionType'));
	const vehicleTypeFilter = filter_Results_State(selectSearchFilterByKey('vehicleType'));
	const engineTypeFilter = filter_Results_State(selectSearchFilterByKey('engineType'));
	const transmissionFilter = filter_Results_State(selectSearchFilterByKey('transmission'));
	const fuelTypeFilter = filter_Results_State(selectSearchFilterByKey('fuelType'));
	const driveTrainFilter = filter_Results_State(selectSearchFilterByKey('driveTrain'));
	const cylindersFilter = filter_Results_State(selectSearchFilterByKey('cylinders'));
	const auctionNameFilter = filter_Results_State(selectSearchFilterByKey('auctionName'));
	const locationFilter = filter_Results_State(selectSearchFilterByKey('location'));
	const bodyStyleFilter = filter_Results_State(selectSearchFilterByKey('bodyStyle'));

	return (
		<div className='flex flex-col '>
			<CheckBoxList title='Sort' options={sort} selected={sortFilter} icon={sortIcon} />
			<CheckBoxList title='Make' options={makes} selected={makeFilter} scrollable searchable icon={makeIcon} />
			<CheckBoxList multiSelect title='Model' options={makes} selected={modelFilter} scrollable searchable icon={modelIcon} />
			<CheckBoxList multiSelect title='Vehicle title type' options={titleType} selected={vehicleTitleTypeFilter} icon={titleTypeIcon} />
			<CheckBoxList title='Vehicle condition type' options={conditionType} selected={vehicleConditionTypeFilter} icon={vehicleConditionIcon} />
			<CheckBoxList multiSelect title='Vehicle type' options={vehicleType} selected={vehicleTypeFilter} scrollable searchable icon={vehicleTypeIcon} />
			<CheckBoxList multiSelect title='Engine type' options={engineType} selected={engineTypeFilter} icon={engineTypeIcon} />
			<CheckBoxList multiSelect title='Transmission' options={transmissionType} selected={transmissionFilter} icon={transmissionIcon} />
			<CheckBoxList multiSelect title='Fuel type' options={fuelType} selected={fuelTypeFilter} icon={fuelTypeIcon} />
			<CheckBoxList multiSelect title='Drive train' options={driveTrain} selected={driveTrainFilter} icon={driveTrainIcon} />
			<CheckBoxList multiSelect title='Cylinders' options={cylinderType} selected={cylindersFilter} icon={cylindersIcon} />
			<CheckBoxList multiSelect title='Auction name' options={auctionName} selected={auctionNameFilter} icon={auctionNameIcon} />
			<CheckBoxList multiSelect title='Location' options={location} selected={locationFilter} scrollable icon={locationIcon} />
			<CheckBoxList multiSelect title='Body style' options={bodyType} selected={bodyStyleFilter} icon={bodyStyleIcon} />
		</div>
	);
}
