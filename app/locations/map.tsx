import { useEffect, useRef, useState } from 'react';
import { location as auctionLocations } from '@/app/inventory/options';
import { fixedLocationCoordinates } from '@/app/locations/locations';
import { loadMap } from './loadMap';
import { statesMap } from '@/img';
import Image from 'next/image';

interface MapProps {
	selectedLocation?: string;
}
export default function Map({ selectedLocation }: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const [mapFailed, setMapFailed] = useState(false);

	useEffect(() => {
		const handleMapFailed = () => setMapFailed(true);
		window.addEventListener('gm-authfailure', handleMapFailed);
		return () => window.removeEventListener('gm-authfailure', handleMapFailed);
	}, []);

	useEffect(() => {
		if (!selectedLocation || !mapRef.current || mapFailed) return;

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
	}, [selectedLocation, mapFailed]);

	useEffect(() => {
		let isMounted = true;

		const initMap = async () => {
			if (!mapRef.current) return;

			// loadMap() must be called FIRST before using google.maps
			const { ok } = await loadMap();
			if (!ok) {
				setMapFailed(true);
				return;
			}

			if (!isMounted || !mapRef.current) return;

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
				if (!position) continue;

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
			setMapFailed(true);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	return <div>{!mapFailed ? <div ref={mapRef} style={{ width: '100%', height: '100vh', zIndex: 1 }} /> : <Image src={statesMap} alt='US States Map' className='w-full' />}</div>;
}
