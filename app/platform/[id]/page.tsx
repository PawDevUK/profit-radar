import { getPlatformWithInvoices } from '../../../lib/platforms';
import Link from 'next/link';
import LoginButton from '../../components/LoginButton';

export const dynamic = 'force-dynamic';

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function PlatformPage({ params }: PageProps) {
	const { id } = await params;
	const data = await getPlatformWithInvoices(id);

	if (!data) {
		return (
			<div className='mainPading py-6'>
				<h1 className='text-2xl font-semibold text-amazon mb-4'>Platform Not Found</h1>
				<p className='text-gray-600'>The platform you&apos;re looking for doesn&apos;t exist.</p>
				<Link href='/dashboard' className='text-blue-600 hover:underline mt-4 inline-block'>
					← Back to Dashboard
				</Link>
			</div>
		);
	}

	const { platform, invoices, totalInvoices } = data;
	const statusColor = platform.isActive ? 'text-green-600' : 'text-red-600';
	const statusBg = platform.isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

	return (
		<div className='mainPading py-6 mt-6'>
			{/* Header */}
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-amazon'>{platform.name}</h1>
				<p className='text-gray-600 mt-2'>
					View and manage all invoices downloaded from this platform. You can log in to fetch new invoices or review existing records below.
				</p>
			</div>

			{/* Status & Login Section */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
				<div className={`rounded-xl border ${statusBg} p-4`}>
					<h3 className='text-sm font-medium text-gray-700 mb-1'>Platform Status</h3>
					<p className={`text-lg font-semibold ${statusColor}`}>{platform.isActive ? '✓ Active' : '✗ Inactive'}</p>
					{platform.last_sync ? (
						<p className='text-xs text-gray-500 mt-1'>Last synced: {new Date(platform.last_sync).toLocaleString()}</p>
					) : (
						<p className='text-xs text-gray-500 mt-1'>Never synced</p>
					)}
				</div>

				<div className='rounded-xl border bg-gray-50 border-gray-200 p-4 flex items-center justify-between'>
					<div>
						<h3 className='text-sm font-medium text-gray-700 mb-1'>Account</h3>
						<p className='text-sm text-gray-600'>{platform.username}</p>
					</div>
					<LoginButton isActive={platform.isActive} />
				</div>
			</div>

			{/* Invoice Summary */}
			<div className='rounded-xl border bg-blue-50 border-blue-200 p-4 mb-6'>
				<h3 className='text-sm font-medium text-gray-700 mb-1'>Invoice Summary</h3>
				<p className='text-2xl font-semibold text-gray-900'>{totalInvoices} invoices downloaded</p>
				{totalInvoices > 0 ? (
					<p className='text-xs text-gray-500 mt-1'>All invoices are listed below</p>
				) : (
					<p className='text-xs text-gray-500 mt-1'>No invoices have been downloaded yet</p>
				)}
			</div>

			{/* Invoice List */}
			<div className='rounded-xl border bg-white border-gray-200 p-6'>
				<h2 className='text-xl font-semibold text-gray-900 mb-4'>All Invoices</h2>
				{totalInvoices === 0 ? (
					<p className='text-gray-500 text-center py-8'>No invoices to display. Sync this platform to fetch invoices.</p>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-left border-collapse'>
							<thead>
								<tr className='border-b border-gray-200'>
									<th className='py-3 px-4 text-sm font-semibold text-gray-700'>Invoice ID</th>
									<th className='py-3 px-4 text-sm font-semibold text-gray-700'>Filename</th>
									<th className='py-3 px-4 text-sm font-semibold text-gray-700'>Downloaded</th>
									<th className='py-3 px-4 text-sm font-semibold text-gray-700'>Status</th>
									<th className='py-3 px-4 text-sm font-semibold text-gray-700'>Amount</th>
								</tr>
							</thead>
							<tbody>
								{invoices.map((invoice) => (
									<tr key={invoice._id} className='border-b border-gray-100 hover:bg-gray-50'>
										<td className='py-3 px-4 text-sm text-gray-900'>{invoice.document_id}</td>
										<td className='py-3 px-4 text-sm text-gray-700'>{invoice.filename}</td>
										<td className='py-3 px-4 text-sm text-gray-600'>{new Date(invoice.downloaded_at).toLocaleDateString()}</td>
										<td className='py-3 px-4 text-sm'>
											{invoice.status ? (
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
													}`}>
													{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
												</span>
											) : (
												<span className='text-gray-400 text-xs'>—</span>
											)}
										</td>
										<td className='py-3 px-4 text-sm text-gray-900'>
											{invoice.amount ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(invoice.amount) : '—'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
