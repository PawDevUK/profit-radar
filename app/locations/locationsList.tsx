'use client';

// import { locationAddresses } from './locationAddresses';
import { locationDetails } from '@/app/locations/locations';
interface LocationTypes {
	selectLocation: (location: string) => void;
}

export default function LocationsList({ selectLocation }: LocationTypes) {
	return (
		<div className={`flex max-h-screen flex-col overflow-y-auto select-none cursor-pointer`}>
			<div>Locations List</div>
			<ul>
				{Object.keys(locationDetails).map((location, i) => (
					<li key={i} onClick={() => selectLocation(location)}>
						{location}
					</li>
				))}
			</ul>
		</div>
	);
}
