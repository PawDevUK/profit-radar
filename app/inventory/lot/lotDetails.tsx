import React from 'react';
import type { LotDetailsType } from '@/lib/types/lotDetails-type';
import { camelCase } from 'lodash';

function formatValue(value: unknown): React.ReactNode {
	if (value === null || value === undefined || value === '') return '—';
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
	return String(value);
}

function Row({ label, value }: { label: string; value: unknown }) {
	return (
		<div className='rounded-md bg-white p-0.5'>
			<div className='text-xs font-medium uppercase tracking-wide text-gray-500'>{label}</div>
			<div className='mt-1 text-sm text-gray-900'>{formatValue(value)}</div>
		</div>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className='rounded-xl border border-gray-200 p-4 bg-white'>
			<h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700'>{title}</h3>
			<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>{children}</div>
		</section>
	);
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
	return (
		<section className=''>
			<div className='grid grid-cols-1 gap-2 md:grid-cols-2 '>{children}</div>
		</section>
	);
}

function returnOnlyDataLotDetails(array: string[], lotData: LotDetailsType) {
	if (Array.isArray(array)) {
		return array.map((element, i) => {
			const property = lotData[camelCase(element) as keyof LotDetailsType];

			if (property && property != null) {
				if (element === 'Odometer Description') {
					return <Row label={'Odo status'} key={i} value={property} />;
				}
				return <Row label={element} key={i} value={property} />;
			}
		});
	}
}

export default function LotDetailsSection({ lotData }: { lotData: LotDetailsType }) {
	const sectionOne = [
		'Make',
		'Model',
		'Year',
		'Trim',
		'Odometer',
		'Odometer Description',
		'Engine Type',
		'Transmission',
		'Drive Train',
		'Fuel Type',
		'Cylinders',
		'Primary Damage',
		'Run And Drive',
		'Has Key',

		'Vehicle Title Type',
		'Odometer Status',
		'Engine Verified',
		'Engine Verified Note',
		'Engine Status',
		'Transmission Engages',
		'Transmission Note',
	];
	const sectionTwo = ['Lot Number', 'Lane Item', 'Sale Name', 'Location', 'Sale Date', 'Auction Name', 'Current Bid', 'Buy It Now', 'Auction Countdown'];
	console.log(lotData);
	return (
		<div className='space-y-2'>
			<SectionWrapper>
				<Section title='Vehicle Overview'>{returnOnlyDataLotDetails(sectionOne, lotData)}</Section>
				<Section title='' gridCol={1}>
					{returnOnlyDataLotDetails(['Title Code'], lotData)}
				</Section>

				<Section title='Auction Information' gridCol={1}>
					{returnOnlyDataLotDetails(sectionTwo, lotData)}
				</Section>
			</SectionWrapper>
		</div>
	);
}
