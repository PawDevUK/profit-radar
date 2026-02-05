'use client';

import { useMemo, useState } from 'react';

type CalendarEvent = {
	id: string;
	title: string;
	time?: string;
	date: string; // ISO date: YYYY-MM-DD
};

type CalendarDay = {
	date: Date;
	label: string;
	isToday: boolean;
	inCurrentMonth: boolean;
	events: CalendarEvent[];
};

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

const sampleEvents: CalendarEvent[] = [
	{ id: '1', title: 'Design review', time: '10:00', date: '2022-01-03' },
	{ id: '2', title: 'Sales meeting', time: '14:00', date: '2022-01-03' },
	{ id: '3', title: 'Date night', time: '18:00', date: '2022-01-07' },
	{ id: '4', title: 'Birthday party', time: '14:00', date: '2022-01-12' },
	{ id: '5', title: 'Maple syrup museum', time: '15:00', date: '2022-01-22' },
	{ id: '6', title: 'Hockey game', time: '19:00', date: '2022-01-22' },
];

const initialDate = sampleEvents[0] ? new Date(sampleEvents[0].date) : new Date();

export default function Calendar() {
	const [currentDate, setCurrentDate] = useState(initialDate);

	const monthLabel = useMemo(() => {
		return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(currentDate);
	}, [currentDate]);

	const days = useMemo(() => buildMonthGrid(currentDate, sampleEvents), [currentDate]);

	const goToToday = () => setCurrentDate(new Date());
	const goToPreviousMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	const goToNextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

	return (
		<div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
			<header className='flex flex-wrap items-center gap-4 border-b border-slate-200 px-6 py-4'>
				<div className='flex flex-1 items-center gap-3'>
					<div className='flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1'>
						<button
							type='button'
							onClick={goToPreviousMonth}
							className='flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100'
							aria-label='Previous month'>
							<svg viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
								<path
									fillRule='evenodd'
									d='M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
						<button type='button' onClick={goToToday} className='rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'>
							Today
						</button>
						<button
							type='button'
							onClick={goToNextMonth}
							className='flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100'
							aria-label='Next month'>
							<svg viewBox='0 0 20 20' fill='currentColor' className='h-5 w-5'>
								<path
									fillRule='evenodd'
									d='M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
					</div>
					<div className='text-left'>
						<p className='text-xs uppercase tracking-wide text-slate-500'>Month</p>
						<h1 className='text-xl font-semibold text-slate-900'>{monthLabel}</h1>
					</div>
				</div>

				<div className='flex items-center gap-3'>
					<div className='relative'>
						<button
							type='button'
							className='flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50'>
							Month view
							<svg viewBox='0 0 20 20' fill='currentColor' className='h-4 w-4 text-slate-500'>
								<path
									fillRule='evenodd'
									d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z'
									clipRule='evenodd'
								/>
							</svg>
						</button>
					</div>
					<button type='button' className='rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'>
						Add event
					</button>
				</div>
			</header>

			<div className='p-6'>
				<div className='grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500'>
					{dayLabels.map((label) => (
						<div key={label} className='py-2'>
							<span>{label}</span>
						</div>
					))}
				</div>

				<div className='mt-2 grid grid-cols-7 gap-2 text-sm'>
					{days.map((day) => {
						const base = 'rounded-lg border p-2 text-left transition';
						const monthClass = day.inCurrentMonth ? 'border-slate-200' : 'border-slate-100 bg-slate-50 text-slate-400';
						const todayClass = day.isToday ? 'border-blue-500' : '';
						return (
							<div key={day.date.toISOString()} className={`${base} ${monthClass} ${todayClass}`}>
								<div className='flex items-start justify-between'>
									<span className='text-sm font-semibold text-slate-800'>{day.label}</span>
									{day.isToday && <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700'>Today</span>}
								</div>
								<div className='mt-2 space-y-1'>
									{day.events.map((event) => (
										<div key={event.id} className='rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-700'>
											<div className='font-medium'>{event.title}</div>
											{event.time ? <div className='text-[11px] text-slate-500'>{event.time}</div> : null}
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
