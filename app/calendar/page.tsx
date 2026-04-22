'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from './calendar';
import { CalendarMonthType } from '@/lib/types/calendar-type';

export default function CalendarPage() {
	const router = useRouter();
	const [sales, setSales] = useState<CalendarMonthType[]>([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		console.log('Loading calendar data!!');
		const fetchSales = async () => {
			setLoading(true);
			try {
				await fetch('/api/copart/db/getAllSaleLists')
					.then((res) => res.json())
					.then((data) => {
						if (data) {
							setSales(data);
							console.log('Calendar data fetched', data);
						} else {
							setError('No Calendar fetched from the Database');
						}
					});
			} catch (e) {
				console.log(e);
				setError('Error fetching data');
			} finally {
				setLoading(false);
			}
		};
		fetchSales();
	}, []);

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<Calendar sales={sales} />
		</div>
	);
}
