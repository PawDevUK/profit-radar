import React from 'react';
import Link from 'next/link';

export default function DocumentationPage() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-white px-4'>
			<div className='text-center max-w-md'>
				{/* Icon */}
				<div className='mb-6 flex justify-center'>
					<div className='w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center'>
						<i className='fa-solid fa-book text-4xl text-purple-600'></i>
					</div>
				</div>

				{/* Heading */}
				<h1 className='text-4xl font-bold text-gray-800 mb-3'>Coming Soon</h1>

				{/* Subheading */}
				<p className='text-lg text-gray-600 mb-2'>Documentation</p>

				{/* Description */}
				<p className='text-gray-500 mb-8 leading-relaxed'>
					Comprehensive guides, API references, and tutorials to help you get the most out of Profit Radar. Clear documentation for every feature.
				</p>

				{/* Features List */}
				<div className='mb-8 text-left'>
					<p className='text-sm font-semibold text-gray-700 mb-4'>What&apos;s coming:</p>
					<ul className='space-y-2'>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Getting started guide
						</li>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							API documentation
						</li>
						<li className='flex items-center text-gray-600'>
							<i className='fa-solid fa-check text-green-500 mr-3'></i>
							Video tutorials
						</li>
					</ul>
				</div>

				{/* Back Button */}
				<Link
					href='/dashboard'
					className='inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all hover:shadow-lg'>
					Back to Dashboard
				</Link>
			</div>
		</div>
	);
}
