'use client';

// import { locationAddresses } from './locationAddresses';
import { locationDetails } from '@/app/locations/locations';
interface LocationTypes {
	selectLocation: (location: string | undefined) => void;
}

export default function LocationsList({ selectLocation }: LocationTypes) {
	return (
		<div className={`flex max-h-60 flex-col overflow-y-auto select-none cursor-pointer md:hidden mt-5`}>
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
