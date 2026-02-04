'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ListingCheckResult = {
	make: string;
	model: string;
	year: string;
	odometer: string;
	listed_otomoto: boolean;
	listing_count?: number;
	lotNumber: string;
	checkedAt: string;
};

export default function OtomotoCheckerPage() {
	const [results, setResults] = useState<ListingCheckResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [lastChecked, setLastChecked] = useState<string>('');

	// Load results on component mount
	useEffect(() => {
		loadResults();
	}, []);

	const loadResults = async () => {
		setLoading(true);
		setError('');
		try {
			const response = await fetch('/api/otomoto-listing-check?action=load');
			const data = await response.json();

			if (data.success) {
				setResults(data.results);
				if (data.results.length > 0) {
					setLastChecked(new Date(data.results[0].checkedAt).toLocaleString());
				}
			} else {
				setError(data.error || 'Failed to load results');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setLoading(false);
		}
	};

	const handleRunCheck = async () => {
		setLoading(true);
		setError('');
		try {
			const response = await fetch('/api/otomoto-listing-check', { method: 'POST' });
			const data = await response.json();

			if (data.success) {
				setResults(data.results);
				if (data.results.length > 0) {
					setLastChecked(new Date(data.results[0].checkedAt).toLocaleString());
				}
			} else {
				setError(data.error || 'Failed to run check');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<Link href='/' className='text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block'>
						← Back to Home
					</Link>
					<h1 className='text-4xl font-bold text-gray-900 mb-2'>Copart ↔ Otomoto Checker</h1>
					<p className='text-lg text-gray-600'>Check if cars from Copart listings appear on Otomoto.pl</p>
				</div>

				{/* Verification Status Info */}
				<div className='bg-blue-50 border border-blue-300 rounded-lg p-4 mb-8'>
					<div className='flex gap-3'>
						<span className='text-2xl'>✓</span>
						<div>
							<h3 className='font-semibold text-blue-900 mb-1'>Automatic Verification Active</h3>
							<p className='text-sm text-blue-800'>Cars are automatically verified against Otomoto.pl listings using the correct URL structure.</p>
						</div>
					</div>
				</div>

				{/* Controls Section */}
				<div className='mb-8'>
					<div className='flex gap-4'>
						<button
							onClick={loadResults}
							disabled={loading}
							className='bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors'>
							{loading ? 'Loading...' : 'Reload Results'}
						</button>
						<button
							onClick={handleRunCheck}
							disabled={loading}
							className='bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors'>
							{loading ? 'Running...' : 'Run New Check'}
						</button>
					</div>

					{lastChecked && <p className='text-sm text-gray-600 mt-4'>Last checked: {lastChecked}</p>}

					{error && <div className='mt-4 p-4 bg-red-100 text-red-700 rounded'>{error}</div>}
				</div>

				{/* Results Section */}
				{results.length > 0 && (
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='px-6 py-4 bg-gray-100 border-b'>
							<h2 className='text-xl font-bold text-gray-900'>Results ({results.length} cars)</h2>
							<p className='text-sm text-gray-600 mt-2'>Verification status shows if cars are found on Otomoto with listing count.</p>
						</div>

						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead>
									<tr className='border-b bg-gray-50'>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Lot #</th>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Year</th>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Make</th>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Model</th>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Odometer</th>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>On Otomoto</th>
										<th className='px-6 py-3 text-left text-sm font-semibold text-gray-900'>Listings</th>
									</tr>
								</thead>
								<tbody>
									{results.map((result) => (
										<tr key={result.lotNumber} className='border-b hover:bg-gray-50'>
											<td className='px-6 py-4 text-sm text-gray-900 font-medium'>{result.lotNumber}</td>
											<td className='px-6 py-4 text-sm text-gray-700'>{result.year}</td>
											<td className='px-6 py-4 text-sm text-gray-700'>{result.make}</td>
											<td className='px-6 py-4 text-sm text-gray-700'>{result.model}</td>
											<td className='px-6 py-4 text-sm text-gray-700'>{result.odometer} km</td>
											<td className='px-6 py-4 text-sm'>
												{result.listed_otomoto ? (
													<span className='inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold'>✓ YES</span>
												) : (
													<span className='inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold'>✗ NO</span>
												)}
											</td>
											<td className='px-6 py-4 text-sm text-gray-900 font-medium'>{result.listed_otomoto ? result.listing_count || 0 : '—'}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{!loading && results.length === 0 && !error && (
					<div className='bg-white rounded-lg shadow-md p-8 text-center'>
						<p className='text-gray-600 mb-4'>No results loaded yet</p>
						<button onClick={loadResults} className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors'>
							Load Results
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
