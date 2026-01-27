'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Sale = {
	id: string;
	saleTime: string;
	saleName: string;
	carsForSale: string;
	currentSale: string;
	nextSale: string;
	totalBuyItNow: string;
	goodDeals: string;
};

export default function CalendarPage() {
	const [selectedSale, setSelectedSale] = useState<string>('CA - Hayward');
	const router = useRouter();

	const sales: Sale[] = [
		{
			id: 'hayward',
			saleTime: '08:00 PM GMT',
			saleName: 'CA - Hayward',
			carsForSale: '250',
			currentSale: 'LIVE NOW',
			nextSale: '01/29-01/30/2026',
			totalBuyItNow: '145',
			goodDeals: '12',
		},
		{
			id: 'sacramento',
			saleTime: '08:00 PM GMT',
			saleName: 'CA - Sacramento',
			carsForSale: '350',
			currentSale: 'LIVE NOW',
			nextSale: '01/29-01/30/2026',
			totalBuyItNow: '278',
			goodDeals: '8',
		},
		{
			id: 'sandiego',
			saleTime: '08:00 PM GMT',
			saleName: 'CA - San Diego',
			carsForSale: '200',
			currentSale: 'LIVE NOW',
			nextSale: '01/29-01/30/2026',
			totalBuyItNow: '92',
			goodDeals: '15',
		},
		{
			id: 'sanjose',
			saleTime: '08:00 PM GMT',
			saleName: 'CA - San Jose',
			carsForSale: '300',
			currentSale: 'LIVE NOW',
			nextSale: '01/29-01/30/2026',
			totalBuyItNow: '234',
			goodDeals: '10',
		},
	];

	const handleRowClick = (saleId: string) => {
		router.push(`/saleListResults/${saleId}`);
	};

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className=' mb-2'>
					<h1 className='text-2xl font-bold text-gray-900 mb-1'>Sale list</h1>
					<p className='text-xsm text-gray-600'>There are lots of good deals.</p>
				</div>
				<div className='mt-6'>
					<div className='overflow-x-auto bg-white rounded-lg shadow'>
						<table className='w-full border-collapse'>
							<thead>
								<tr className='bg-gray-100 border-b-2 border-gray-300'>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Sale Time
									</th>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Sale Name
									</th>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Lots on sale
									</th>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Buy It Now
									</th>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Good Deals
									</th>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Current Sale
									</th>
									<th scope='col' className='px-6 py-4 text-left font-semibold text-gray-900'>
										Next Sale
									</th>
								</tr>
							</thead>
							<tbody>
								{sales.map((sale, index) => (
									<tr key={index} onClick={() => handleRowClick(sale.id)} className='border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer'>
										<td className='px-6 py-4 text-gray-700'>{sale.saleTime}</td>
										<td className='px-6 py-4 text-gray-900 font-medium'>{sale.saleName}</td>
										<td className='px-6 py-4 text-gray-700'>{sale.carsForSale}</td>
										<td className='px-6 py-4 text-gray-900 font-medium text-blue-600'>{sale.totalBuyItNow}</td>
										<td className='px-6 py-4 text-gray-700'>{sale.goodDeals}</td>
										<td className='px-6 py-4'>
											<span className='bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium'>{sale.currentSale}</span>
										</td>
										<td className='px-6 py-4 text-gray-700'>{sale.nextSale}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
