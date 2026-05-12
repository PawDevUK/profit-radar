'use client';

import { useEffect } from 'react';
import { useAllCarsStore } from '@/lib/state/allCars.state';

export default function AppBootstrap() {
	const hasLoaded = useAllCarsStore((state) => state.hasLoaded);
	const isLoading = useAllCarsStore((state) => state.isLoading);
	const fetchAllSaleLists = useAllCarsStore((state) => state.fetchAllSaleLists);

	useEffect(() => {
		if (!hasLoaded && !isLoading) {
			void fetchAllSaleLists();
		}
	}, [hasLoaded, isLoading, fetchAllSaleLists]);

	return null;
}
