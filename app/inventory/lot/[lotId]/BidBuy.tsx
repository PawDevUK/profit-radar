import React from 'react';
import { LotDetailsType } from '@/lib/types/lotDetails-type';

export default function BidBuy({ car }: { car: LotDetailsType }) {
	return (
		<div>
			<div>
				<div className='bg-white rounded-lg shadow p-6 mb-6'>
					<div className='space-y-4'>
						<div>
							<h3 className='font-semibold text-gray-600 text-sm mb-1'>Current Bid</h3>
							<p className='text-3xl font-bold text-blue-600'>{car.currentBid ? `$${car.currentBid.toLocaleString()}` : 'N/A'}</p>
						</div>
						{car.buyItNow !== null && (
							<div className='pt-4 border-t border-gray-200'>
								<h3 className='font-semibold text-gray-600 text-sm mb-1'>Buy It Now Price</h3>
								<p className='text-3xl font-bold text-green-600'>${car.buyItNow.toLocaleString()}</p>
								<p className='text-xs text-gray-500 mt-2'>End the auction immediately at this price</p>
							</div>
						)}
					</div>
				</div>
				<div className='space-y-3 mb-6'>
					<button className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition'>Place Bid</button>
					<button className='w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition'>Buy It Now</button>
					<button className='w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition'>Add to Watchlist</button>
				</div>
			</div>
		</div>
	);
}
