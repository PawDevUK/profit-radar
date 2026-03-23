import Link from 'next/link';
import { ClipboardCheck, FileSearch, ShieldCheck, Wrench } from 'lucide-react';
import ManiLayout from '../components/common/pageWrapper';

const reportItems = [
	{
		title: 'AutoCheck Reports',
		description: 'Access clean-title vehicle history, including previous incident records, title events, and additional ownership context before placing a bid.',
		href: '/documentation',
		icon: FileSearch,
		cta: 'Learn more',
	},
	{
		title: 'Vehicle Condition Reports',
		description: 'Review deeper condition insights, including expanded feature checks, visual evidence, and practical notes that support a safer buying decision.',
		href: '/documentation',
		icon: ClipboardCheck,
		cta: 'Learn more',
	},
];

export default function ServicesSupport() {
	return (
		<ManiLayout>
			<div className='space-y-5 pb-10'>
				<section className='overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 via-blue-600 to-sky-500 px-6 py-14 text-white md:px-10'>
					<div className='mx-auto max-w-6xl'>
						<h1 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>Vehicle Reports</h1>
						<h2 className='mt-4 max-w-3xl text-lg text-blue-100 sm:text-2xl'>
							Review a vehicle&apos;s history with AutoCheck, condition reports, and lot-level insights before you commit.
						</h2>
					</div>
				</section>

				<section className='pr-card bg-white'>
					<p className='text-lg leading-relaxed text-gray-700'>
						As a ProfitRadar user, you can use multiple report layers to make informed buying decisions. Each report provides a different view of vehicle history and
						condition, so you can understand risk before bidding. Report access points are surfaced alongside lot details where the source data is available.
					</p>
				</section>

				<section className='rounded-2xl bg-slate-100/80 px-4 py-10 md:px-8'>
					<div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-2'>
						{reportItems.map((item) => {
							const Icon = item.icon;

							return (
								<div key={item.title} className='rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
									<div className='mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
										<Icon className='h-7 w-7' />
									</div>
									<h3 className='text-xl font-semibold text-blue-600'>{item.title}</h3>
									<p className='mt-3 text-gray-700'>{item.description}</p>
									<Link href={item.href} className='mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline'>
										{item.cta} {'>'}
									</Link>
								</div>
							);
						})}
					</div>
				</section>

				<section className='rounded-2xl bg-linear-to-b from-white to-blue-100 px-6 py-10 md:px-10'>
					<div className='mx-auto max-w-6xl space-y-6 text-gray-700'>
						<p className='leading-relaxed'>
							Beyond AutoCheck and condition reports, you can also use VIN data for independent third-party checks and arrange external inspections when required.
						</p>
						<p className='leading-relaxed'>
							<strong>Bonus tip:</strong> if you are new to online vehicle auctions, visit the platform guides and support sections to learn how bidding, risk
							evaluation, and deal validation work in practice.
						</p>
						<p className='leading-relaxed'>
							Once you have reviewed reports and guidance resources, you are ready to shortlist opportunities and continue in inventory search.
						</p>

						<div className='flex flex-wrap gap-3 pt-2'>
							<Link
								href='/inventory'
								className='inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700'>
								Search Inventory
							</Link>
							<Link
								href='/documentation'
								className='inline-flex items-center rounded-full border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50'>
								Open Documentation
							</Link>
						</div>
					</div>
				</section>

				<section className='pr-card bg-white'>
					<div className='grid gap-4 md:grid-cols-2'>
						<div className='flex items-start gap-3'>
							<ShieldCheck className='mt-1 h-5 w-5 text-blue-600' />
							<p className='text-sm text-gray-700'>Use reports to verify title and condition details before adding a lot to your final deal list.</p>
						</div>
						<div className='flex items-start gap-3'>
							<Wrench className='mt-1 h-5 w-5 text-blue-600' />
							<p className='text-sm text-gray-700'>Combine report evidence with your transport, repair, and resale assumptions for more realistic margin planning.</p>
						</div>
					</div>
				</section>
			</div>
		</ManiLayout>
	);
}
