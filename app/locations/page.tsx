'use client';

import { useEffect, useRef } from 'react';
import { location as auctionLocations } from '@/app/inventory/options';
import { fixedLocationCoordinates } from '@/app/locations/locations';
import { loadMap } from './map';

export default function Locations() {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let isMounted = true;

		const initMap = async () => {
			if (!mapRef.current) return;

			await loadMap();

			if (!isMounted || !mapRef.current || !window.google?.maps) return;

			const { Map } = (await window.google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

			const map = new Map(mapRef.current, {
				center: { lat: 39.5, lng: -98.35 },
				zoom: 4,
			});

			const bounds = new window.google.maps.LatLngBounds();

			for (const rawLocation of auctionLocations) {
				if (!isMounted) return;

				const position = fixedLocationCoordinates[rawLocation];

				if (!position) {
					continue;
				}

				new window.google.maps.Marker({
					map,
					position,
					title: rawLocation,
				});

				bounds.extend(position);
			}

			if (!bounds.isEmpty()) {
				map.fitBounds(bounds);
			}
		};

		initMap().catch((error) => {
			console.error('Google Maps initialization failed:', error);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<div>Locations</div>
			<div ref={mapRef} style={{ width: '80%', height: '80vh' }} />
		</>
	);
}
