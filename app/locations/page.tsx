'use client';
import Map from '@/app/locations/map';
import { locationDetails, LocationDetailsMap } from './locations';
import { useEffect, useState } from 'react';
import SearchBar from '@/app/components/search/search';
import LocationsList from './locationsList';

export default function Locations() {
	const returnlocationArray = (locations: LocationDetailsMap) => {
		return Object.keys(locations);
	};
	const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);

	useEffect(() => {
		const prevBodyOverscroll = document.body.style.overscrollBehaviorY;
		const prevHtmlOverscroll = document.documentElement.style.overscrollBehaviorY;

		document.body.style.overscrollBehaviorY = 'none';
		document.documentElement.style.overscrollBehaviorY = 'none';

		return () => {
			document.body.style.overscrollBehaviorY = prevBodyOverscroll;
			document.documentElement.style.overscrollBehaviorY = prevHtmlOverscroll;
		};
	}, []);

	return (
		<div className='relative flex flex-col h-full w-screen overflow-x-hidden '>
			<div className='z-10 absolute top-15 left-0 right-0 px-5 md:top-10 md:px-2 h-40 pointer-events-none'>
				<SearchBar
					locationListSelected={selectedLocation}
					placeholderText='Search location'
					options={returnlocationArray(locationDetails)}
					componentType='locationList'
					handleOnChange={(query) => {
						setSelectedLocation(query);
					}}></SearchBar>
			</div>
			<Map selectedLocation={selectedLocation}></Map>
			{/* <LocationsList selectLocation={setSelectedLocation}></LocationsList> */}
		</div>
	);
}
