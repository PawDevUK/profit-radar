import { useEffect, useRef, useState } from 'react';
import { location as auctionLocations } from '@/app/inventory/options';
import { locationDetails } from './locations';
import { loadMap } from './loadMap';
import { statesMap } from '@/img';
import Image from 'next/image';

const DEFAULT_CENTER = { lat: 39.5, lng: -98.35 };

interface MapProps {
	selectedLocation?: string;
}
export default function Map({ selectedLocation }: MapProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const googleMapRef = useRef<google.maps.Map | null>(null);
	const selectedMarkerRef = useRef<google.maps.Marker | null>(null);
	const selectedInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
	const [mapFailed, setMapFailed] = useState(false);

	useEffect(() => {
		const handleMapFailed = () => setMapFailed(true);
		window.addEventListener('gm-authfailure', handleMapFailed);
		return () => window.removeEventListener('gm-authfailure', handleMapFailed);
	}, []);

	useEffect(() => {
		if (!selectedLocation || !googleMapRef.current) return;

		const detail = locationDetails[selectedLocation];
		if (!detail) return;

		const { address, lat, lng } = detail;
		const coord = { lat, lng };

		const map = googleMapRef.current;

		// Clean up previous selection
		selectedInfoWindowRef.current?.close();
		selectedMarkerRef.current?.setMap(null);

		// Pan to and zoom on the selected location
		map.panTo(coord);
		map.setZoom(18);
		map.setMapTypeId(google.maps.MapTypeId.SATELLITE);

		const marker = new window.google.maps.Marker({
			position: coord,
			map,
			title: selectedLocation,
		});

		const infoWindow = new window.google.maps.InfoWindow({
			content: `<div style="min-width:220px"><strong>${selectedLocation}</strong><br/><span>${address}</span></div>`,
		});

		marker.addListener('click', () => {
			infoWindow.open({ anchor: marker, map });
		});

		infoWindow.open({ anchor: marker, map });

		selectedMarkerRef.current = marker;
		selectedInfoWindowRef.current = infoWindow;
	}, [selectedLocation]);

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
				center: DEFAULT_CENTER,
				zoom: 4,
			});

			googleMapRef.current = map;

			const bounds = new window.google.maps.LatLngBounds();
			const markers: google.maps.Marker[] = [];

			for (const rawLocation of auctionLocations.filter((loc) => loc !== 'HI - HONOLULU')) {
				if (!isMounted) return;
				const detail = locationDetails[rawLocation];
				if (!detail) continue;

				const { address, lat, lng } = detail;
				const coord = { lat, lng };

				const marker = new window.google.maps.Marker({
					map,
					position: coord,
					title: rawLocation,
				});

				const infoWindow = new window.google.maps.InfoWindow({
					content: `<div style="min-width:220px"><strong>${rawLocation}</strong><br/><span>${address}</span></div>`,
				});

				marker.addListener('click', () => {
					markers.forEach((m) => {
						if (m !== marker) m.setMap(null);
					});
					infoWindow.open({ anchor: marker, map });
					map.panTo(coord);
					map.setZoom(15);
					map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
				});

				markers.push(marker);
				bounds.extend(coord);
			}

			if (!bounds.isEmpty()) {
				map.fitBounds(bounds);
			}
		};

		initMap().catch((error) => {
			console.error('Map initialization failed:', error);
			setMapFailed(true);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className='h-150 md:h-screen'>
			{!mapFailed ? <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} /> : <Image src={statesMap} alt='US States Map' className='w-full' />}
		</div>
	);
}
