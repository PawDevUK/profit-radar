'use client';

import { useMemo, useState } from 'react';

type CalendarEvent = {
	id: string;
	title: string;
	time?: string;
	date: string; // ISO date: YYYY-MM-DD
	location?: string;
	image?: string;
};

type CalendarAuction = {
	location: string;
	saleDate: string;
	saleTime?: string;
	viewSalesLink: string;
	numberOnSale?: number | null;
};

type CalendarDay = {
	date: Date;
	label: string;
	isToday: boolean;
	inCurrentMonth: boolean;
	events: CalendarEvent[];
};

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const formatIsoDate = (date: Date) => {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const buildMonthGrid = (anchor: Date, events: CalendarEvent[]): CalendarDay[] => {
	const year = anchor.getFullYear();
	const month = anchor.getMonth();

	const firstOfMonth = new Date(year, month, 1);
	const weekday = (firstOfMonth.getDay() + 6) % 7; // shift so Monday is 0
	const start = new Date(year, month, 1 - weekday);

	const todayIso = formatIsoDate(new Date());
	const eventMap = events.reduce<Record<string, CalendarEvent[]>>((acc, evt) => {
		acc[evt.date] = acc[evt.date] ? [...acc[evt.date], evt] : [evt];
		return acc;
	}, {});

	const days: CalendarDay[] = [];
	for (let i = 0; i < 42; i += 1) {
		const current = new Date(start);
		current.setDate(start.getDate() + i);
		const iso = formatIsoDate(current);
		days.push({
			date: current,
			label: `${current.getDate()}`,
			isToday: iso === todayIso,
			inCurrentMonth: current.getMonth() === month,
			events: eventMap[iso] || [],
		});
	}

	return days;
};
const getTodaysEvents = (events: CalendarEvent[]) => {
	const todayIso = formatIsoDate(new Date());
	return events.filter((evt) => evt.date === todayIso);
};

const setDayEvents = (date: Date, events: CalendarEvent[], setDisplayDay: React.Dispatch<React.SetStateAction<CalendarEvent[]>>) => {
	const iso = formatIsoDate(date);

	const filteredEvents = events.filter((evt) => evt.date === iso);

	setDisplayDay(filteredEvents);
};

export default function Calendar({ sales }: { sales: CalendarAuction[] }) {
	const events: CalendarEvent[] = sales.map((sale) => ({
		id: `${sale.location}-${sale.saleDate}`,
		title: sale.location,
		time: sale.saleTime,
		date: sale.saleDate,
		location: sale.location,
		image: '',
	}));

	const [currentDate, setCurrentDate] = useState(new Date());
	const [displayDay, setDisplayDay] = useState<CalendarEvent[]>(getTodaysEvents(events));

	const monthLabel = useMemo(() => {
		return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(currentDate);
	}, [currentDate]);

	const days = useMemo(() => buildMonthGrid(currentDate, events), [currentDate, events]);

	const goToPreviousMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	const goToNextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

	return (
		<div className='flex justify-center'>
			<div className='rounded-xl border border-slate-200 bg-white shadow-sm lg:w-225 md:w-175 '>
				<div className='px-6 py-4'>
					<h2 className='text-lg font-semibold text-gray-900'>Upcoming Auctions</h2>
					<div className='mt-6'>
						<div className='flex justify-center space-x-2'>
							<div className='flex items-center space-x-2'>
								<button
									type='button'
									onClick={goToPreviousMonth}
									className='flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500'>
									<span className='sr-only'>Previous month</span>
									<svg viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
										<path
											d='M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z'
											clipRule='evenodd'
											fillRule='evenodd'
										/>
									</svg>
								</button>
								<h3 className='text-sm font-semibold text-gray-900'>{monthLabel}</h3>
								<button
									type='button'
									onClick={goToNextMonth}
									className='flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500'>
									<span className='sr-only'>Next month</span>
									<svg viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
										<path
											d='M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z'
											clipRule='evenodd'
											fillRule='evenodd'
										/>
									</svg>
								</button>
							</div>
						</div>
						<div className='mt-6 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-gray-500'>
							{dayLabels.map((label) => (
								<div key={label} className='py-2'>
									{label}
								</div>
							))}
						</div>
						<div className='mt-2 grid grid-cols-7 gap-1'>
							{days.map((day) => (
								<button
									onClick={() => setDayEvents(day.date, events, setDisplayDay)}
									key={day.date.toISOString()}
									type='button'
									className={`relative flex h-9 w-full items-center justify-center rounded-md text-sm font-medium ${
										day.inCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-400'
									} ${day.isToday ? 'bg-blue-50 text-blue-600' : ''}`}>
									<time dateTime={formatIsoDate(day.date)} className='text-sm'>
										{day.label}
									</time>
									{day.events.length > 0 && <div className='absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600'></div>}
								</button>
							))}
						</div>
					</div>
				</div>
				<div className='border-t border-gray-200 px-6 py-4'>
					<ol className='divide-y divide-gray-200'>
						{displayDay.map((event) => (
							<li key={event.id} className='flex items-center space-x-4 py-4'>
								{/* <img src={event.image} alt="" className="h-10 w-10 rounded-full" /> */}
								<div className='flex-1'>
									<h3 className='text-sm font-medium text-gray-900'>{event.title}</h3>
									<dl className='mt-1 flex space-x-4 text-xs text-gray-500'>
										<div>
											<dt className='sr-only'>Date</dt>
											<dd>
												<time dateTime={event.date}>
													{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
													{event.time && ` at ${event.time}`}
												</time>
											</dd>
										</div>
										{event.location && (
											<div>
												<dt className='sr-only'>Location</dt>
												<dd>{event.location}</dd>
											</div>
										)}
									</dl>
								</div>
								<div className='flex-shrink-0'>
									<button type='button' className='text-gray-400 hover:text-gray-500'>
										<span className='sr-only'>Open options</span>
										<svg viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
											<path d='M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z' />
										</svg>
									</button>
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
}
