'use client';

import { fixedLocationCoordinates } from '@/app/locations/locations';

interface LocationTypes {
	selectLocation: (location: string) => void;
}

export default function LocationsList({ selectLocation }: LocationTypes) {
	return (
		<div className={`flex max-h-screen flex-col overflow-y-auto select-none cursor-pointer`}>
			<div>Locations List</div>
			<ul>
				{Object.keys(fixedLocationCoordinates).map((location) => (
					<li key={location} onClick={() => selectLocation(location)}>
						{location}
					</li>
				))}
			</ul>
		</div>
	);
}
