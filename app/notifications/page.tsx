import React from 'react';
import Link from 'next/link';

export default function NotificationsPage() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white px-4'>
			<div className='text-center max-w-md'>
				{/* Icon */}
				<div className='mb-6 flex justify-center'>
					<div className='w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center'>
						<i className='fa-solid fa-bell text-4xl text-blue-600'></i>
					</div>
				</div>

				{/* Heading */}
				<h1 className='text-4xl font-bold text-gray-800 mb-3'>Coming Soon</h1>

				{/* Subheading */}
				<p className='text-lg text-gray-600 mb-2'>Notifications</p>

				{/* Description */}
				<p className='text-gray-500 mb-8 leading-relaxed'>
					Stay updated with real-time notifications about your document processing, platform updates, and important activities. We&apos;re crafting the perfect
					notification experience for you.
				</p>

				{/* Features List */}
				<div className='mb-8 text-left'>
					<p className='text-sm font-semibold text-gray-700 mb-4'>What&apos;s coming:</p>
					<ul className='space-y-2'>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Real-time notifications
						</li>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Custom notification preferences
						</li>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Email digest options
						</li>
					</ul>
				</div>

				{/* Back Button */}
				<Link
					href='/dashboard'
					className='inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-lg'>
					Back to Dashboard
				</Link>
			</div>
		</div>
	);
}
