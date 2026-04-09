import React from 'react';

export default function profitSection() {
	return (
		<div>
			{/* <div className='bg-white rounded-lg shadow p-6 mb-6'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='font-bold text-gray-900 flex items-center gap-2'>
						<span>🚗</span> Otomoto Check
					</h3>
					<button
						onClick={runOtomotoVerification}
						disabled={otomotoLoading}
						className='px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition'>
						{otomotoLoading ? 'Checking...' : 'Check Now'}
					</button>
				</div>
				{otomotoLoading ? (
					<div className='text-center py-4'>
						<div className='flex items-center justify-center gap-2 mb-2'>
							<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
							<span className='text-gray-600'>Checking Otomoto...</span>
						</div>
						<p className='text-xs text-gray-500'>This may take a moment</p>
					</div>
				) : otomotoResult ? (
					<div className='space-y-3'>
						{otomotoResult.found ? (
							<div className='bg-green-50 border border-green-300 rounded p-3'>
								<div className='flex items-center gap-2'>
									<span className='text-xl'>✓</span>
									<div>
										<p className='font-semibold text-green-900'>Found on Otomoto!</p>
										<p className='text-sm text-green-700'>
											{otomotoResult.count} listing{otomotoResult.count !== 1 ? 's' : ''} found
										</p>
										<a
											href={otomotoResult.url}
											target='_blank'
											rel='noopener noreferrer'
											className='text-sm text-green-600 hover:text-green-800 mt-2 inline-block'>
											View on Otomoto →
										</a>
									</div>
								</div>
							</div>
						) : (
							<div className='bg-red-50 border border-red-300 rounded p-3'>
								<div className='flex items-center gap-2'>
									<span className='text-xl'>✗</span>
									<div>
										<p className='font-semibold text-red-900'>Not found on Otomoto</p>
										<p className='text-sm text-red-700'>No listings match this make/model</p>
									</div>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className='text-center py-3'>
						<p className='text-gray-600 text-sm'>Click &quot;Check Now&quot; to verify on Otomoto</p>
					</div>
				)}
			</div> */}
		</div>
	);
}
