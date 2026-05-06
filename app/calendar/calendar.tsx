'use client';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { CalendarType, SaleListType, createEmptyCalendarList } from '@/lib/types/calendar-type';

type CalendarDay = {
	date: Date;
	label: string;
	isToday: boolean;
	inCurrentMonth: boolean;
	events: SaleListType[];
};

const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const buildMonthGrid = (anchor: Date, events: SaleListType[]): CalendarDay[] => {
	const year = anchor.getFullYear();
	const month = anchor.getMonth();

	const firstOfMonth = new Date(year, month, 1);
	const weekday = (firstOfMonth.getDay() + 6) % 7; // shift so Monday is 0
	const start = new Date(year, month, 1 - weekday);

	const todayIso = format(new Date(), 'yyyy-MM-dd');

	const eventMap = events.reduce<Record<string, SaleListType[]>>((acc, evt) => {
		const currentSale = evt.currentSale !== 'LIVE NOW' ? evt.currentSale : todayIso;
		if (currentSale) {
			const iso = format(new Date(currentSale), 'yyyy-MM-dd');
			acc[iso] = acc[iso] ? [...acc[iso], evt] : [evt];
		}
		return acc;
	}, {});

	const days: CalendarDay[] = [];
	for (let i = 0; i < 42; i += 1) {
		const current = new Date(start);
		current.setDate(start.getDate() + i);
		const iso = format(current, 'yyyy-MM-dd');
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

const setDayEvents = (date: Date, events: SaleListType[], setDisplayDay: React.Dispatch<React.SetStateAction<SaleListType[]>>) => {
	const iso = format(date, 'yyyy-MM-dd');

	const filteredEvents = events.filter((evt) => {
		if (evt?.currentSale) {
			return format(new Date(evt?.currentSale), 'yyyy-MM-dd') === iso;
		}
	});

	setDisplayDay(filteredEvents);
};

export default function Calendar({ allAuctions, todaysEvents }: { allAuctions: CalendarType[]; todaysEvents: SaleListType[] }) {
	const events: SaleListType[] = allAuctions.map((month) => month.auctions).flat();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [displayDay, setDisplayDay] = useState<SaleListType[]>(todaysEvents);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setDisplayDay(todaysEvents);
	}, [todaysEvents]);

	useEffect(() => {
		if (displayDay && events.length > 0) {
			setLoading(false);
		}
	}, [displayDay, events]);

	const monthLabel = useMemo(() => {
		return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(currentDate);
	}, [currentDate]);

	const days = useMemo(() => buildMonthGrid(currentDate, events), [currentDate, events]);

	const goToPreviousMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	const goToNextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading calendar...</p>
				</div>
			</div>
		);
	}
	return (
		<div className='flex justify-center w-full'>
			<div className='rounded-xl border border-slate-200 bg-white shadow-sm w-[80vw] lg:w-225 '>
				<div className='px-6 py-4'>
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
							{dayLabels.map((label, i) => (
								<div key={i} className='py-2'>
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
									<time dateTime={format(day.date, 'yyyy-MM-dd')} className='text-sm'>
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
						{displayDay.map((event, i) => (
							<li key={i} className='flex items-center space-x-4 py-4'>
								{/* <img src={event.image} alt="" className="h-10 w-10 rounded-full" /> */}
								<div className='flex-1'>
									<h3 className='text-sm font-medium text-gray-900'>{event.saleName}</h3>
									<dl className='mt-1 flex space-x-4 text-xs text-gray-500'>
										<div>
											<dt className='sr-only'>Date</dt>
											<dd>
												<time dateTime={event.currentSale?.toString() ?? undefined}>
													{event.currentSale &&
														new Date(event.currentSale).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
													{event.saleTime && ` at ${event.saleTime}`}
												</time>
											</dd>
										</div>
										{event.saleName && (
											<div>
												<dt className='sr-only'>Location</dt>
												<dd>{event.saleName}</dd>
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
