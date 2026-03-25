'use client';
import Map from '@/app/locations/map';
import { locationDetails, LocationDetailsMap } from './locations';
import { useState } from 'react';
import SearchBar from '@/app/components/search/search';
import LocationsList from './locationsList';

export default function Locations() {
	const returnlocationArray = (locations: LocationDetailsMap) => {
		return Object.keys(locations);
	};
	const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);

	return (
		<div className='flex flex-col h-screen w-full relative p-5 '>
			<div className='z-10 flex flex-row absolute top-20 left-7 md:top-15 md:left-2 w-[70%]'>
				<SearchBar
					locationListSelected={selectedLocation}
					placeholderText='Search location'
					options={returnlocationArray(locationDetails)}
					handleOnChange={(query) => {
						setSelectedLocation(query);
					}}></SearchBar>
			</div>
			<Map selectedLocation={selectedLocation}></Map>
			<LocationsList selectLocation={setSelectedLocation}></LocationsList>
		</div>
	);
}
