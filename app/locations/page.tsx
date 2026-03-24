'use client';
import Map from '@/app/locations/map';
// import LoctionsList from '@/app/locations/locationsList';
import { fixedLocationCoordinates } from '@/app/locations/locations';
import { useState } from 'react';
import SearchBar from '@/app/components/search/search';

export default function Locations() {
	const returnlocationArray = (locations: typeof FixedLocationCoordinates) => {
		return Object.keys(locations);
	};
	const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);

	return (
		<div className='flex flex-col h-full w-full relative'>
			<div className='z-10 flex flex-row absolute top-15 left-2 w-[90%]'>
				<SearchBar placeholderText='Search location' options={returnlocationArray(fixedLocationCoordinates)} handleOnChange={(query) => {}}></SearchBar>
			</div>
			<Map selectedLocation={selectedLocation}></Map>
		</div>
	);
}
