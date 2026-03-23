'use client';
import Map from '@/app/locations/map';
import LocationsList from '@/app/locations/locationsList';
import { useState } from 'react';

export default function Locations() {
	const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);

	return (
		<div className='flex flex-row h-full'>
			<Map selectedLocation={selectedLocation}></Map>
			<LocationsList
				selectLocation={(location: string) => {
					setSelectedLocation(location);
				}}></LocationsList>
		</div>
	);
}
