import React from 'react';

type StatCardProps = {
	title: string;
	value: number | string;
	subtitle?: string;
	accent?: 'blue' | 'green' | 'orange' | 'purple' | 'gray' | 'red';
};

const accentMap: Record<NonNullable<StatCardProps['accent']>, string> = {
	blue: 'bg-blue-50 border-blue-200',
	green: 'bg-green-50 border-green-200',
	orange: 'bg-orange-50 border-orange-200',
	purple: 'bg-purple-50 border-purple-200',
	gray: 'bg-gray-50 border-gray-200',
	red: 'bg-red-50 border-red-200',
};

export default function StatCard({ title, value, subtitle, accent = 'gray' }: StatCardProps) {
	const accentClass = accentMap[accent] ?? accentMap.gray;
	return (
		<div className={`rounded-xl border ${accentClass} p-4 flex flex-col gap-1`}>
			<div className='text-sm text-gray-600'>{title}</div>
			<div className='text-3xl font-semibold text-gray-900'>{value}</div> {subtitle ? <div className='text-xs text-gray-500'>{subtitle}</div> : null}{' '}
		</div>
	);
}
