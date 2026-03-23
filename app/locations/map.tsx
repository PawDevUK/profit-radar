import React from 'react';

import { useEffect, useRef } from 'react';
import { location as auctionLocations } from '@/app/inventory/options';
import { fixedLocationCoordinates } from '@/app/locations/locations';
import { loadMap } from './loadMap';
interface MapProps {
	selectedLocation?: string;
}
export default function Map({ selectedLocation }: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!selectedLocation || !mapRef.current) return;

		const position = fixedLocationCoordinates[selectedLocation];
		if (!position) return;

		const map = new window.google.maps.Map(mapRef.current, {
			center: position,
			zoom: 10,
		});

		const marker = new window.google.maps.Marker({
			position,
			map,
			title: selectedLocation,
		});

		return () => {
			marker.setMap(null);
		};
	}, [selectedLocation]);

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
			const markers: google.maps.Marker[] = [];

			for (const rawLocation of auctionLocations) {
				if (!isMounted) return;

				const position = fixedLocationCoordinates[rawLocation];

				if (!position) {
					continue;
				}

				const marker = new window.google.maps.Marker({
					map,
					position,
					title: rawLocation,
				});

				marker.addListener('click', () => {
					markers.forEach((m) => {
						if (m !== marker) m.setMap(null);
					});
					map.panTo(position);
					map.setZoom(10);
				});

				markers.push(marker);
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

	return <div ref={mapRef} style={{ width: '80%', height: '100vh' }} />;
}
