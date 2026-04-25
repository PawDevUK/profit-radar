'use client';

import { useEffect } from 'react';
import { allCars_State } from '@/lib/state/allCars.state';

export default function AppBootstrap() {
	const hasLoaded = allCars_State((state) => state.hasLoaded);
	const isLoading = allCars_State((state) => state.isLoading);
	const fetchAllSaleLists = allCars_State((state) => state.fetchAllSaleLists);

	useEffect(() => {
		if (!hasLoaded && !isLoading) {
			void fetchAllSaleLists();
		}
	}, [hasLoaded, isLoading, fetchAllSaleLists]);

	return null;
}
