'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type Car = {
	id: string;
	image: string;
	lotInfo: string;
	vehicleInfo: string;
	condition: string;
	saleInfo: string;
	bids: string;
};

export default function SaleListResultsPage() {
	const params = useParams();
	const router = useRouter();
	const saleId = params.id as string;

	// Mock data for cars - in a real app, this would come from an API
	const carsData: { [key: string]: Car[] } = {
		hayward: [
			{
				id: '1',
				image: 'Image 1',
				lotInfo: 'Lot #12345',
				vehicleInfo: '2020 Honda Civic',
				condition: 'Good',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '5',
			},
			{
				id: '2',
				image: 'Image 2',
				lotInfo: 'Lot #12346',
				vehicleInfo: '2019 Toyota Camry',
				condition: 'Fair',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '8',
			},
			{
				id: '3',
				image: 'Image 3',
				lotInfo: 'Lot #12347',
				vehicleInfo: '2021 Ford F-150',
				condition: 'Excellent',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '12',
			},
		],
		sacramento: [
			{
				id: '1',
				image: 'Image 1',
				lotInfo: 'Lot #54321',
				vehicleInfo: '2018 BMW 3 Series',
				condition: 'Good',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '3',
			},
			{
				id: '2',
				image: 'Image 2',
				lotInfo: 'Lot #54322',
				vehicleInfo: '2020 Chevrolet Malibu',
				condition: 'Fair',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '6',
			},
		],
		sandiego: [
			{
				id: '1',
				image: 'Image 1',
				lotInfo: 'Lot #99001',
				vehicleInfo: '2022 Tesla Model 3',
				condition: 'Excellent',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '15',
			},
			{
				id: '2',
				image: 'Image 2',
				lotInfo: 'Lot #99002',
				vehicleInfo: '2019 Mazda CX-5',
				condition: 'Good',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '7',
			},
		],
		sanjose: [
			{
				id: '1',
				image: 'Image 1',
				lotInfo: 'Lot #77001',
				vehicleInfo: '2021 Hyundai Santa Fe',
				condition: 'Excellent',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '9',
			},
			{
				id: '2',
				image: 'Image 2',
				lotInfo: 'Lot #77002',
				vehicleInfo: '2020 Kia Sportage',
				condition: 'Good',
				saleInfo: 'Auction ends 01/30/2026',
				bids: '4',
			},
		],
	};

	const cars = carsData[saleId] || [];

	const handleRowClick = (carId: string) => {
		router.push(`/saleListResults/${saleId}/lot/${carId}`);
	};

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='mb-6'>
					<button onClick={() => router.back()} className='text-blue-600 hover:text-blue-800 font-medium mb-4'>
						← Back to Sales
					</button>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>Sale List Results</h1>
					<p className='text-gray-600'>Showing {cars.length} cars for sale</p>
				</div>

				<div className='overflow-x-auto bg-white rounded-lg shadow'>
					<table className='w-full border-collapse'>
						<thead>
							<tr className='bg-gray-100 border-b-2 border-gray-300'>
								<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
									Image
								</th>
								<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
									Lot Info
								</th>
								<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
									Vehicle Info
								</th>
								<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
									Condition
								</th>
								<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
									Sale Info
								</th>
								<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
									Bids
								</th>
							</tr>
						</thead>
						<tbody>
							{cars.map((car, index) => (
								<tr 
									key={index}
									onClick={() => handleRowClick(car.id)}
									className='border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer'
								>
									<td className='px-6 py-4 text-gray-700'>{car.image}</td>
									<td className='px-6 py-4 text-gray-900 font-medium'>{car.lotInfo}</td>
									<td className='px-6 py-4 text-gray-700'>{car.vehicleInfo}</td>
									<td className='px-6 py-4'>
										<span
											className={`text-sm px-3 py-1 rounded-full font-medium ${
												car.condition === 'Excellent'
													? 'bg-green-100 text-green-800'
													: car.condition === 'Good'
														? 'bg-blue-100 text-blue-800'
														: 'bg-yellow-100 text-yellow-800'
											}`}>
											{car.condition}
										</span>
									</td>
									<td className='px-6 py-4 text-gray-700'>{car.saleInfo}</td>
									<td className='px-6 py-4 text-gray-900 font-medium'>{car.bids}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{cars.length === 0 && (
					<div className='text-center py-12'>
						<p className='text-gray-500 text-lg'>No cars found for this sale</p>
					</div>
				)}
			</div>
		</div>
	);
}
