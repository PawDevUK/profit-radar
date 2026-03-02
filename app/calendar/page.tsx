'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import marchSale from '../../results/calendar_March.json';
import CalendarList from './list';
import Calendar from './calendar';

type Sale = {
	location: string;
	saleDate: string;
	saleTime: string;
	viewSalesLink: string;
	numberOnSale?: number | null;
};

export default function CalendarPage() {
	const router = useRouter();
	const [sales, setSales] = useState<Sale[]>(marchSale.auctions);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			{/* <CalendarList /> */}
			<Calendar sales={sales} />
		</div>
	);
}
