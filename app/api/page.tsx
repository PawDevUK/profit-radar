import React from 'react';
import Link from 'next/link';

export default function ApiConnectPage() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white px-4'>
			<div className='text-center max-w-md'>
				{/* Icon */}
				<div className='mb-6 flex justify-center'>
					<div className='w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center'>
						<i className='fa-solid fa-plug text-4xl text-orange-600'></i>
					</div>
				</div>

				{/* Heading */}
				<h1 className='text-4xl font-bold text-gray-800 mb-3'>Coming Soon</h1>

				{/* Subheading */}
				<p className='text-lg text-gray-600 mb-2'>API Connect</p>

				{/* Description */}
				<p className='text-gray-500 mb-8 leading-relaxed'>
					Connect your favorite tools and services to Profit Radar. Integrate with webhooks, REST APIs, and more for powerful automation.
				</p>

				{/* Features List */}
				<div className='mb-8 text-left'>
					<p className='text-sm font-semibold text-gray-700 mb-4'>What&apos;s coming:</p>
					<ul className='space-y-2'>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							REST API access
						</li>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Webhook integrations
						</li>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Pre-built connectors
						</li>
					</ul>
				</div>

				{/* Back Button */}
				<Link
					href='/dashboard'
					className='inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-all hover:shadow-lg'>
					Back to Dashboard
				</Link>
			</div>
		</div>
	);
}
