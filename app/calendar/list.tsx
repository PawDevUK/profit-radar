'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import febSale from '../results/calendar_March.json';

type Sale = {
	location: string;
	saleDate: string;
	saleTime: string;
	viewSalesLink: string;
	numberOnSale?: number | null;
};

export default function CalendarList() {
	const router = useRouter();
	const [sales, setSales] = useState<Sale[]>(febSale.auctions);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<div className='min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className=' mb-2'>
					<h1 className='text-xl font-bold text-gray-900 mb-1'>Copart Auction Calendar</h1>
					<p className='text-xsm text-gray-600'>{loading ? 'Loading...' : `${sales.length} auctions available`}</p>
				</div>
				<div className='mt-6'>
					<div className='overflow-x-auto bg-white rounded-lg shadow'>
						<table className='w-full border-collapse'>
							<thead>
								<tr className='bg-gray-100 border-b-2 border-gray-300'>
									<th scope='col' className='px-6 py-4 text-left font-bold text-gray-900 w-1/5'>
										Location
									</th>
									<th scope='col' className='px-6 py-4 text-left font-bold text-gray-900 w-1/'>
										Sale Date
									</th>
									<th scope='col' className='px-6 py-4 text-left font-bold text-gray-900'>
										Sale Time
									</th>
									<th scope='col' className='px-6 py-4 text-left font-bold text-gray-900'>
										Lots
									</th>
									<th scope='col' className='px-6 py-4 text-left font-bold text-gray-900'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{sales.map((sale, index) => (
									<tr key={index} className='border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer'>
										<td className='px-6 py-1 text-gray-900 font-sm'>{sale.location}</td>
										<td className='px-6 py-1 text-gray-700'>{sale.saleDate}</td>
										<td className='px-6 py-1 text-gray-700'>{sale.saleTime}</td>
										<td className='px-6 py-1 text-gray-700'>
											{typeof sale.numberOnSale === 'number' ? (
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
													{sale.numberOnSale}
												</span>
											) : (
												<span className='text-gray-400'>—</span>
											)}
										</td>
										<td className='px-6 py-1'>
											<span className='text-blue-600 hover:text-blue-800 font-medium hover:underline'>View Listings →</span>
										</td>
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
