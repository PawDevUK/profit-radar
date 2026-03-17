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

import { filter_Results_State } from '@/lib/state/searchFilters_STATE';

import { Engine, Gears, VehicleType, CarCondition, DriveType, V8Icon, sizeIcons, strokeIcons, colorIcons } from './searchIcons';

interface SideSearchProps {
	resetAll: boolean;
}

export default function SideSearch({ resetAll }: SideSearchProps) {
	const { searchFilters } = filter_Results_State();

	return (
		<div className='flex flex-col '>
			<CheckBoxList title='Sort' options={sort} selected={searchFilters.sort} icon={<ArrowDownUp strokeWidth={strokeIcons} className='checkboxIcon' />} />
			<CheckBoxList title='Make' options={makes} selected={searchFilters.make} scrollable searchable icon={<CarFront strokeWidth={strokeIcons} className='checkboxIcon' />} />
			<CheckBoxList
				multiSelect
				title='Model'
				options={makes}
				selected={searchFilters.model}
				scrollable
				searchable
				icon={<KeySquare strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				multiSelect
				title='Vehicle title type'
				options={titleType}
				selected={searchFilters.vehicleTitleType}
				icon={<ListTodo strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				title='Vehicle condition type'
				options={conditionType}
				selected={searchFilters.vehicleConditionType}
				icon={<CarCondition size={sizeIcons} color={colorIcons} />}
			/>
			<CheckBoxList
				multiSelect
				title='Vehicle type'
				options={vehicleType}
				selected={searchFilters.vehicleType}
				scrollable
				searchable
				icon={<VehicleType size={sizeIcons} color={colorIcons} />}
			/>
			<CheckBoxList multiSelect title='Engine type' options={engineType} selected={searchFilters.engineType} icon={<Engine />} />
			<CheckBoxList multiSelect title='Transmission' options={transmissionType} selected={searchFilters.transmission} icon={<Gears />} />
			<CheckBoxList multiSelect title='Fuel type' options={fuelType} selected={searchFilters.fuelType} icon={<Fuel strokeWidth={strokeIcons} className='checkboxIcon' />} />
			<CheckBoxList multiSelect title='Drive train' options={driveTrain} selected={searchFilters.driveTrain} icon={<DriveType size={sizeIcons} color={colorIcons} />} />
			<CheckBoxList multiSelect title='Cylinders' options={cylinderType} selected={searchFilters.cylinders} icon={<V8Icon size={sizeIcons} color={colorIcons} />} />
			<CheckBoxList
				multiSelect
				title='Auction name'
				options={auctionName}
				selected={searchFilters.auctionName}
				icon={<Gavel strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList
				multiSelect
				title='Location'
				options={location}
				selected={searchFilters.location}
				scrollable
				icon={<MapPin strokeWidth={strokeIcons} className='checkboxIcon' />}
			/>
			<CheckBoxList multiSelect title='Body style' options={bodyType} selected={searchFilters.bodyStyle} icon={<Car strokeWidth={strokeIcons} className='checkboxIcon' />} />
		</div>
	);
}
