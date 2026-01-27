'use client';

import { useParams, useRouter } from 'next/navigation';

type LotDetails = {
	id: string;
	title: string;
	lotNumber: string;
	vin: string;
	laneItem: string;
	year: number;
	make: string;
	model: string;
	bodyType: string;
	color: string;
	transmission: string;
	odometer: string;
	primaryDamage: string;
	titleCode: string;
	hasKey: string;
	saleDate: string;
	currentBid: string;
	buyItNow: string;
	minimumBid: string;
	highlights: string[];
	vehicleReport: {
		engineStarts: boolean;
		transmissionEngages: boolean;
	};
	notes: string;
	condition: string;
};

export default function LotDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const saleId = params.id as string;
	const lotId = params.lotId as string;

	// Mock data for lot details
	const lotsData: { [key: string]: { [key: string]: LotDetails } } = {
		hayward: {
			'1': {
				id: '1',
				title: '2020 Honda Civic',
				lotNumber: '12345',
				vin: 'JH2RC5305LM200078',
				laneItem: 'B/1045',
				year: 2020,
				make: 'Honda',
				model: 'Civic',
				bodyType: 'Sedan',
				color: 'Silver',
				transmission: 'Automatic',
				odometer: '45,230 mi',
				primaryDamage: 'Minor Dent',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$8,500',
				buyItNow: '$10,200',
				minimumBid: '$7,500',
				highlights: ['Run and Drive', 'Clean Title'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Well-maintained vehicle with full service history. Recent oil change and tire replacement.',
				condition: 'Good',
			},
			'2': {
				id: '2',
				title: '2019 Toyota Camry',
				lotNumber: '12346',
				vin: 'JT2BF18K1J0202803',
				laneItem: 'B/1046',
				year: 2019,
				make: 'Toyota',
				model: 'Camry',
				bodyType: 'Sedan',
				color: 'Black',
				transmission: 'Automatic',
				odometer: '62,150 mi',
				primaryDamage: 'Normal Wear',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$12,300',
				buyItNow: '$14,500',
				minimumBid: '$11,000',
				highlights: ['Run and Drive'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Reliable sedan with excellent fuel efficiency. Interior in good condition.',
				condition: 'Fair',
			},
			'3': {
				id: '3',
				title: '2021 Ford F-150',
				lotNumber: '12347',
				vin: '1FTFW1ET5DFC55555',
				laneItem: 'B/1047',
				year: 2021,
				make: 'Ford',
				model: 'F-150',
				bodyType: 'Pickup Truck',
				color: 'Red',
				transmission: 'Automatic',
				odometer: '28,500 mi',
				primaryDamage: 'Minor Dent',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$22,500',
				buyItNow: '$25,800',
				minimumBid: '$20,000',
				highlights: ['Run and Drive', 'Clean Title', 'Low Mileage'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Excellent condition truck with towing package. Recently serviced.',
				condition: 'Excellent',
			},
		},
		sacramento: {
			'1': {
				id: '1',
				title: '2018 BMW 3 Series',
				lotNumber: '54321',
				vin: 'WBADT43452G805899',
				laneItem: 'B/2001',
				year: 2018,
				make: 'BMW',
				model: '3 Series',
				bodyType: 'Sedan',
				color: 'White',
				transmission: 'Automatic',
				odometer: '71,200 mi',
				primaryDamage: 'Minor Dent',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$15,800',
				buyItNow: '$18,500',
				minimumBid: '$14,000',
				highlights: ['Run and Drive'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Premium sedan with luxury features. All systems functional.',
				condition: 'Good',
			},
			'2': {
				id: '2',
				title: '2020 Chevrolet Malibu',
				lotNumber: '54322',
				vin: '1G1ZB5ST6JF156925',
				laneItem: 'B/2002',
				year: 2020,
				make: 'Chevrolet',
				model: 'Malibu',
				bodyType: 'Sedan',
				color: 'Gray',
				transmission: 'Automatic',
				odometer: '51,300 mi',
				primaryDamage: 'Normal Wear',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$9,200',
				buyItNow: '$11,000',
				minimumBid: '$8,500',
				highlights: ['Run and Drive'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Solid family sedan with good interior. Routine maintenance up to date.',
				condition: 'Fair',
			},
		},
		sandiego: {
			'1': {
				id: '1',
				title: '2022 Tesla Model 3',
				lotNumber: '99001',
				vin: '5YJ3E1EA2NF123456',
				laneItem: 'B/3001',
				year: 2022,
				make: 'Tesla',
				model: 'Model 3',
				bodyType: 'Sedan',
				color: 'Pearl White',
				transmission: 'Automatic',
				odometer: '15,400 mi',
				primaryDamage: 'None',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$31,500',
				buyItNow: '$35,900',
				minimumBid: '$29,000',
				highlights: ['Run and Drive', 'Clean Title', 'Low Mileage', 'Electric Vehicle'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Like-new condition Tesla with autopilot. Full battery capacity.',
				condition: 'Excellent',
			},
			'2': {
				id: '2',
				title: '2019 Mazda CX-5',
				lotNumber: '99002',
				vin: 'JM2BJ101592220045',
				laneItem: 'B/3002',
				year: 2019,
				make: 'Mazda',
				model: 'CX-5',
				bodyType: 'SUV',
				color: 'Blue',
				transmission: 'Automatic',
				odometer: '58,900 mi',
				primaryDamage: 'Minor Dent',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$16,800',
				buyItNow: '$19,500',
				minimumBid: '$15,500',
				highlights: ['Run and Drive'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Reliable SUV with AWD. Excellent for families or adventurers.',
				condition: 'Good',
			},
		},
		sanjose: {
			'1': {
				id: '1',
				title: '2021 Hyundai Santa Fe',
				lotNumber: '77001',
				vin: '5NMS5CAD5MH123456',
				laneItem: 'B/4001',
				year: 2021,
				make: 'Hyundai',
				model: 'Santa Fe',
				bodyType: 'SUV',
				color: 'Black',
				transmission: 'Automatic',
				odometer: '34,200 mi',
				primaryDamage: 'None',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '$22,100',
				buyItNow: '$25,500',
				minimumBid: '$20,500',
				highlights: ['Run and Drive', 'Clean Title', 'Low Mileage'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Three-row SUV in excellent condition. Perfect family vehicle.',
				condition: 'Excellent',
			},
			'2': {
				id: '2',
				title: '2020 Kia Sportage',
				lotNumber: '77002',
				vin: 'KNDPC3A48L7123456',
				laneItem: 'B/4002',
				year: 2020,
				make: 'Kia',
				model: 'Sportage',
				bodyType: 'SUV',
				color: 'Silver',
				transmission: 'Automatic',
				odometer: '47,600 mi',
				primaryDamage: 'Minor Dent',
				titleCode: 'CA - Title',
				hasKey: 'Yes',
				saleDate: 'Wed. Jan 28, 2026 02:00 AM GMT',
				currentBid: '18,500',
				buyItNow: '$21,200',
				minimumBid: '$17,000',
				highlights: ['Run and Drive'],
				vehicleReport: {
					engineStarts: true,
					transmissionEngages: true,
				},
				notes: 'Stylish compact SUV with great features. Great condition.',
				condition: 'Good',
			},
		},
	};

	const lot = lotsData[saleId]?.[lotId];

	if (!lot) {
		return (
			<div className='min-h-screen bg-gray-50 py-6 px-4'>
				<div className='max-w-7xl mx-auto'>
					<button onClick={() => router.back()} className='text-blue-600 hover:text-blue-800 font-medium mb-6'>
						← Back
					</button>
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>Lot not found</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='bg-white shadow sticky top-0 z-10'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='flex justify-between items-center'>
						<div>
							<button onClick={() => router.back()} className='text-blue-600 hover:text-blue-800 font-medium mb-3 block'>
								← Back to results
							</button>
							<h1 className='text-3xl font-bold text-gray-900'>{lot.title}</h1>
						</div>
						<div className='text-right'>
							<p className='text-2xl font-bold text-blue-600'>{lot.currentBid}</p>
							<p className='text-sm text-gray-500'>Current bid</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Left Column - Images and Main Info */}
					<div className='lg:col-span-2'>
						{/* Image Placeholder */}
						<div className='bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-6'>
							<span className='text-gray-500 text-lg'>Vehicle Images</span>
						</div>

						{/* Basic Information */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<h2 className='text-xl font-bold text-gray-900 mb-4'>Lot Information</h2>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-gray-600'>Lot Number</p>
									<p className='font-medium text-gray-900'>{lot.lotNumber}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Lane/Item</p>
									<p className='font-medium text-gray-900'>{lot.laneItem}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>VIN</p>
									<p className='font-medium text-gray-900 break-all'>{lot.vin}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Title Code</p>
									<p className='font-medium text-gray-900'>{lot.titleCode}</p>
								</div>
							</div>
						</div>

						{/* Vehicle Details */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<h2 className='text-xl font-bold text-gray-900 mb-4'>Vehicle Details</h2>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-gray-600'>Year</p>
									<p className='font-medium text-gray-900'>{lot.year}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Make</p>
									<p className='font-medium text-gray-900'>{lot.make}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Model</p>
									<p className='font-medium text-gray-900'>{lot.model}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Body Type</p>
									<p className='font-medium text-gray-900'>{lot.bodyType}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Color</p>
									<p className='font-medium text-gray-900'>{lot.color}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Transmission</p>
									<p className='font-medium text-gray-900'>{lot.transmission}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Odometer</p>
									<p className='font-medium text-gray-900'>{lot.odometer}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Has Key</p>
									<p className='font-medium text-gray-900'>{lot.hasKey}</p>
								</div>
								<div className='col-span-2'>
									<p className='text-sm text-gray-600'>Primary Damage</p>
									<p className='font-medium text-gray-900'>{lot.primaryDamage}</p>
								</div>
							</div>
						</div>

						{/* Vehicle Report */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<h2 className='text-xl font-bold text-gray-900 mb-4'>Vehicle Report</h2>
							<div className='space-y-3'>
								<div className='flex items-center'>
									<span className={`w-3 h-3 rounded-full mr-3 ${lot.vehicleReport.engineStarts ? 'bg-green-500' : 'bg-red-500'}`}></span>
									<span className='text-gray-900'>Engine Starts: {lot.vehicleReport.engineStarts ? 'Yes' : 'No'}</span>
								</div>
								<div className='flex items-center'>
									<span className={`w-3 h-3 rounded-full mr-3 ${lot.vehicleReport.transmissionEngages ? 'bg-green-500' : 'bg-red-500'}`}></span>
									<span className='text-gray-900'>Transmission Engages: {lot.vehicleReport.transmissionEngages ? 'Yes' : 'No'}</span>
								</div>
							</div>
						</div>

						{/* Highlights */}
						{lot.highlights.length > 0 && (
							<div className='bg-white rounded-lg shadow p-6 mb-6'>
								<h2 className='text-xl font-bold text-gray-900 mb-4'>Highlights</h2>
								<div className='flex flex-wrap gap-2'>
									{lot.highlights.map((highlight, index) => (
										<span key={index} className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
											{highlight}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Notes */}
						<div className='bg-white rounded-lg shadow p-6'>
							<h2 className='text-xl font-bold text-gray-900 mb-4'>Additional Notes</h2>
							<p className='text-gray-700'>{lot.notes}</p>
						</div>
					</div>

					{/* Right Column - Bidding Info */}
					<div>
						{/* Condition Badge */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<p className='text-sm text-gray-600 mb-2'>Condition</p>
							<span
								className={`inline-block px-4 py-2 rounded-full font-bold text-white ${
									lot.condition === 'Excellent' ? 'bg-green-600' : lot.condition === 'Good' ? 'bg-blue-600' : 'bg-yellow-600'
								}`}>
								{lot.condition}
							</span>
						</div>

						{/* Sale Information */}
						<div className='bg-white rounded-lg shadow p-6 mb-6'>
							<h3 className='font-bold text-gray-900 mb-4'>Sale Information</h3>
							<div className='space-y-3'>
								<div>
									<p className='text-sm text-gray-600'>Sale Date</p>
									<p className='font-medium text-gray-900'>{lot.saleDate}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Minimum Bid</p>
									<p className='font-medium text-gray-900'>{lot.minimumBid}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Current Bid</p>
									<p className='text-2xl font-bold text-blue-600'>{lot.currentBid}</p>
								</div>
								<div>
									<p className='text-sm text-gray-600'>Buy It Now</p>
									<p className='font-medium text-green-600 text-lg'>{lot.buyItNow}</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className='space-y-3'>
							<button className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition'>Place Bid</button>
							<button className='w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition'>Buy It Now</button>
							<button className='w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition'>Add to Watchlist</button>
						</div>

						{/* Disclaimer */}
						<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6'>
							<p className='text-sm text-yellow-800'>
								<strong>Note:</strong> All bids are legally binding and all sales are final. Please review all vehicle information before bidding.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
