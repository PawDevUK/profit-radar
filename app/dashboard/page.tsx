import StatCard from '../components/StatCard';
import { getDashboardMetrics } from '../../lib/metrics';

export const dynamic = 'force-dynamic';

export default async function Page() {
	const metrics = await getDashboardMetrics();

	return (
		<div className='mainPading py-6'>
			<h1 className='text-2xl font-semibold text-amazon mb-4'>Dashboard</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<StatCard title='Platforms Supported' value={metrics.platformsSupported} accent='blue' />
				<StatCard title='Platforms Active' value={metrics.platformsActive} subtitle='Synced at least once' accent='green' />
				<StatCard title='Platforms Inactive' value={metrics.platformsInactive} subtitle='No recent sync' accent='red' />
				<StatCard title='Invoices Downloaded' value={metrics.invoicesDownloaded} accent='purple' />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
				<StatCard title='Invoices Due' value={metrics.invoicesDue} accent='orange' subtitle={metrics.invoicesDue === 0 ? 'Tracking pending' : undefined} />
				<StatCard title='Invoices Paid' value={metrics.invoicesPaid} accent='green' subtitle={metrics.invoicesPaid === 0 ? 'Tracking pending' : undefined} />
				<StatCard title='Total Paid' value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(metrics.totalPaidAmount)} accent='blue' />
				<StatCard title='Total To Pay' value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'GBP' }).format(metrics.totalDueAmount)} accent='red' />
			</div>
		</div>
	);
}
