'use client';

import { useEffect } from 'react';
import { useAllCars, useFetchAllSaleLists, useIsLoading, useHasLoaded } from '@/lib/state/allCars.state';

export default function AppBootstrap() {
	const hasLoaded = useHasLoaded();
	const isLoading = useIsLoading();
	const fetchAllSaleLists = useFetchAllSaleLists();

	useEffect(() => {
		if (!hasLoaded && !isLoading) {
			void fetchAllSaleLists();
		}
	}, [hasLoaded, isLoading]); // Remove fetchAllSaleLists from here

	return null;
}
