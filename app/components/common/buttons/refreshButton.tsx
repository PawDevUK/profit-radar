import { RefreshCw } from 'lucide-react';
import { useState, useRef } from 'react';

export default function RefreshButton() {
	const [fetching, setFetching] = useState(false);
	const controllerRef = useRef<AbortController | null>(null);

	async function scrapeCalendar() {
		if (fetching) {
			controllerRef.current?.abort();
			return;
		}
		const controller = new AbortController();
		controllerRef.current = controller;
		setFetching(true);
		try {
			const response = await fetch('http://localhost:3000/api/copart/scrape-calendar', {
				signal: controller.signal,
			});
			if (!response.ok) {
				throw new Error('Request failed');
			}
		} catch (e) {
			console.error(e);
		} finally {
			setFetching(false);
		}
	}

	return (
		<button
			className='hover:bg-(--mongo-green-light-hover) items-center justify-center rounded-md
                         flex h-7 text-gray-600  hover:text-gray-700 border hover:border-(--mongo-green)'
			onClick={scrapeCalendar}>
			<div className='hidden md:block ml-2'>{fetching ? 'Stop' : 'Refresh Calendar'}</div>
			<RefreshCw className={`h-4 w-4 m-2 ${fetching ? 'spinning-svg' : ''}`} />
		</button>
	);
}
