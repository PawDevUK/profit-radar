import React from 'react';
import type { LotDetailsType } from '@/lib/types/lotDetails-type';

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

export default function LotDetailsSection({ lotData }: { lotData: LotDetailsType }) {
	return (
		<div className='space-y-2'>
			<SectionWrapper>
				<Section title='Vehicle Overview'>
					{/* <Row label='Title' value={lotData.title} /> */}
					<Row label='Make' value={lotData.make} />
					<Row label='Model' value={lotData.model} />
					<Row label='Year' value={lotData.year} />
					<Row label='Trim' value={lotData.trim} />
					<Row label='Body Style' value={lotData.bodyStyle} />
					<Row label='Vehicle Type' value={lotData.vehicleType} />
					<Row label='Color' value={lotData.color} />
				</Section>

				<Section title='Auction Information'>
					<Row label='Lot Number' value={lotData.lotNumber} />
					{/* <Row label='Lane Item' value={lotData.laneItem} /> */}
					{/* <Row label='Sale Name' value={lotData.saleName} /> */}
					<Row label='Location' value={lotData.location} />
					<Row label='Sale Date' value={lotData.saleDate} />
					<Row label='Auction Name' value={lotData.auctionName} />
					<Row label='Current Bid' value={`$${lotData.currentBid}`} />
					{/* <Row label='Buy It Now' value={lotData.buyItNow} /> */}
					<Row label='Auction Countdown' value={lotData.auctionCountdown} />
					{/* <Row label='Copart Link' value={lotData.copartLink} /> */}
				</Section>
			</SectionWrapper>

			<SectionWrapper>
				<Section title='Condition'>
					<Row label='Primary Damage' value={lotData.primaryDamage} />
					<Row label='Run And Drive' value={lotData.runAndDrive} />
					<Row label='Has Key' value={lotData.hasKey} />
					<Row label='Title Code' value={lotData.titleCode} />
					<Row label='Vehicle Title Type' value={lotData.vehicleTitleType} />
					<Row label='Odometer' value={lotData.odometer} />
					{/* <Row label='Odometer Unit' value={lotData.odometerUnit} /> */}
					<Row label='Odometer Status' value={lotData.odometerStatus} />
					<Row label='Engine Verified' value={lotData.engineVerified} />
					<Row label='Engine Verified Note' value={lotData.engineVerifiedNote} />
					<Row label='Engine Status' value={lotData.engineStatus} />
					<Row label='Transmission Engages' value={lotData.transmissionEngages} />
					<Row label='Transmission Note' value={lotData.transmissionNote} />
				</Section>

				<Section title='Technical Specs'>
					<Row label='VIN' value={lotData.vin} />
					<Row label='Engine Type' value={lotData.engineType} />
					<Row label='Transmission' value={lotData.transmission} />
					<Row label='Drive Train' value={lotData.driveTrain} />
					<Row label='Fuel Type' value={lotData.fuelType} />
					<Row label='Cylinders' value={lotData.cylinders} />
				</Section>
			</SectionWrapper>
		</div>
	);
}
