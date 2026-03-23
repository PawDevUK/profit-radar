// components/HowItWorks.tsx
import Link from 'next/link';
import Image from 'next/image';
import { bmw535, tiguan, chargergt } from '@/img';
import ManiLayout from '../components/common/pageWrapper';
import LogButton from '../components/common/buttons/logButton';

export default function HowItWorks() {
	return (
		<div>
			<ManiLayout>
				<section className='bg-white my-5'>
					<div className='w-full'>
						{/* Heading */}
						{/* Main content grid */}
						<div className='grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center pr-card  p-7 md:p-10'>
							<div className='space-y-8 lg:space-y-10'>
								<div className=''>
									<h2 className='text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl lg:text-5xl'>How it Works</h2>
								</div>
								<div className='space-y-5'>
									<h3 className='text-2xl font-bold text-gray-700 sm:text-3xl mb-10'>
										Scan Auction Inventory at Scale
										<br />
										Compare with the Polish Market
									</h3>

									<p className='text-lg leading-relaxed text-gray-700'>
										ProfitRadar automatically scans Copart auction data across calendars, sale lists, and lot details to track vehicles in real time. The
										platform normalises key fields like VIN, year, make, model, condition, odometer, damage, and pricing so you can review opportunities faster.
									</p>

									<p className='text-lg leading-relaxed text-gray-700'>
										Each lot is then compared with listings from at the moment Polish market (planned to extend it to international markets) to estimate resale
										potential and highlight the
										<span className='font-semibold'> best deal candidates</span> based on market spread.
									</p>
									<div className='md:w-90 py-5'>
										<LogButton item={{ href: '/inventory', label: 'Start Deal Search', fontSize: 18 }}></LogButton>
									</div>
								</div>
							</div>
							<div className='grid grid-cols-2 gap-4 sm:gap-6'>
								{/* Image 1 - Inspector / Tablet */}
								<div className='aspect-[4/3] overflow-hidden rounded-xl shadow-lg'>
									<Image src={bmw535} alt='BMW 535i white' className='h-full w-full object-cover' loading='lazy' placeholder='blur' />
								</div>

								{/* Image 2 - Tow truck / Sports car */}
								<div className='aspect-[4/3] overflow-hidden rounded-xl shadow-lg'>
									<Image src={tiguan} alt='VW tiguan grey.' className='h-full w-full object-cover' loading='lazy' width={400} height={300} />
								</div>

								{/* Image 3 - Large lot overview (spans both columns) */}
								<div className='col-span-2 aspect-[16/9] overflow-hidden rounded-xl shadow-lg'>
									<Image src={chargergt} alt='Doge Charger red' className='h-full w-full object-cover' width={800} height={450} />
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className='bg-white my-5'>
					<div className='space-y-5 pr-card'>
						<h3 className='text-2xl font-bold text-blue-600 sm:text-3xl'>Get Started in Minutes</h3>
						<p className='text-lg leading-relaxed text-gray-700'>
							Choose your target vehicles, budget, and auction filters. ProfitRadar keeps the data fresh, compares auction prices with Polish market benchmarks, and
							helps you focus only on listings with the strongest margin potential.
						</p>
						<div className='md:w-90 py-5'>
							<LogButton item={{ href: '/signup', label: 'Create Account', fontSize: 18 }}></LogButton>
						</div>
						{/* <Link
							href='/signup'
							className='inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors'>
							Register Now
						</Link> */}
					</div>
				</section>
				<section className='bg-white my-5  mb-12'>
					<div className=' w-full pr-card'>
						{/* Heading */}
						<div className='text-center '>
							<h2 className='text-2xl font-bold text-blue-600 sm:text-3xl'>How ProfitRadar Finds Opportunities</h2>
							<p className='mt-4 text-lg text-gray-600'>
								From auction ingestion to Polish market comparison, every step is designed to help you spot profitable imports faster.
							</p>
						</div>

						{/* Three-column grid */}
						<div className='grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12 p-4'>
							{/* Column 1: Data collection pipeline */}
							<div className='space-y-6'>
								{/* Scan Auction Calendar */}
								<div className='text-center md:text-left h-[50%]'>
									<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
										{/* Cloud Upload Icon */}
										<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
											/>
										</svg>
									</div>
									<h3 className='text-xl font-semibold text-blue-600'>Scan Auction Calendar</h3>
									<p className='mt-3 text-gray-600'>
										Track auction events across 275+ locations and monitor upcoming sale dates so you never miss relevant inventory.
									</p>
									<div className='mt-4 space-y-1 text-sm'>
										<Link href='/calendar' className='block text-blue-600 hover:underline'>
											Auction Calendar →
										</Link>
										<Link href='/auctions' className='block text-blue-600 hover:underline'>
											Auctions Overview →
										</Link>
										<Link href='/documentation' className='block text-blue-600 hover:underline'>
											Data Flow Notes →
										</Link>
									</div>
								</div>

								{/* Ingest Sale Lists */}
								<div className='text-center md:text-left h-[50%]'>
									<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
										{/* Calendar Icon */}
										<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
									</div>
									<h3 className='text-xl font-semibold text-blue-600'>Ingest Sale Lists</h3>
									<p className='mt-3 text-gray-600'>
										Collect live listing data at scale, including photos, bid signals, and lot metadata, then merge updates to keep the feed current.
									</p>
									<div className='mt-4 space-y-1 text-sm'>
										<Link href='/inventory' className='block text-blue-600 hover:underline'>
											Inventory Search →
										</Link>
										<Link href='/dashboard' className='block text-blue-600 hover:underline'>
											Tracking Dashboard →
										</Link>
										<Link href='/auctions' className='block text-blue-600 hover:underline'>
											Auction Feed →
										</Link>
									</div>
								</div>
							</div>

							{/* Column 2: Analysis pipeline */}
							<div className='space-y-10'>
								{/* Examine Lot Details */}
								<div className='text-center md:text-left h-[50%]'>
									<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
										{/* Document Check Icon */}
										<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
											/>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4' />
										</svg>
									</div>
									<h3 className='text-xl font-semibold text-blue-600'>Examine Lot Details</h3>
									<p className='mt-3 text-gray-600'>
										Open a lot to review VIN, title, engine and transmission status, damage notes, odometer, images, and buy-now or bid data in one place.
									</p>
									<div className='mt-4 space-y-1 text-sm'>
										<Link href='/inventory' className='block text-blue-600 hover:underline'>
											Lot Explorer →
										</Link>
										<Link href='/documentation' className='block text-blue-600 hover:underline'>
											Lot Data Fields →
										</Link>
									</div>
								</div>

								{/* Compare with Polish Market */}
								<div className='text-center md:text-left h-[50%]'>
									<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
										{/* Gavel / Bid Icon placeholder */}
										<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
										</svg>
									</div>
									<h3 className='text-xl font-semibold text-blue-600'>Compare with Polish Market</h3>
									<p className='mt-3 text-gray-600'>
										ProfitRadar matches auction lots with Otomoto references to estimate market value in Poland and reveal the strongest arbitrage spread.
									</p>
									<div className='mt-4 space-y-1 text-sm'>
										<Link href='/otomoto-checker' className='block text-blue-600 hover:underline'>
											Otomoto Checker →
										</Link>
										<Link href='/inventory' className='block text-blue-600 hover:underline'>
											Compare Candidate Lots →
										</Link>
									</div>
								</div>
							</div>

							{/* Column 3: Decision workflow */}
							<div className='space-y-10 h-full'>
								{/* Find and Prioritise Best Deals */}
								<div className='text-center md:text-left h-[50%] '>
									<section className=''>
										<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
											{/* Heart + Search Icon */}
											<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
												/>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
												/>
											</svg>
										</div>
									</section>
									<section className=''>
										<h3 className='text-xl font-semibold text-blue-600'>Find and Prioritise Best Deals</h3>
										<p className='mt-3 text-gray-600'>
											Use filters, sorting, and saved searches to focus on vehicles with the best expected margin instead of manually checking every listing.
										</p>
									</section>
									<section className=''>
										<div className='h-full mt-4 space-y-1 text-sm'>
											<Link href='/inventory' className='block text-blue-600 hover:underline'>
												Vehicle Finder Tool →
											</Link>
											<Link href='/notifications' className='block text-blue-600 hover:underline'>
												Alerts & Tracking →
											</Link>
											<Link href='/inventory' className='block text-blue-600 hover:underline'>
												Saved Filters →
											</Link>
										</div>
									</section>
								</div>

								{/* Final Review and Next Actions */}
								<div className='text-center md:text-left h-[50%]'>
									<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
										{/* Truck Delivery Icon */}
										<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
											/>
										</svg>
									</div>
									<h3 className='text-xl font-semibold text-blue-600'>Validate and Execute</h3>
									<p className='mt-3 text-gray-600'>
										Review top-ranked opportunities, verify lot photos and damage notes, then move to your preferred bidding and logistics workflow.
									</p>
									<div className='mt-4 space-y-1 text-sm'>
										<Link href='/howItWorks' className='block text-blue-600 hover:underline'>
											Workflow Overview →
										</Link>
										<Link href='/documentation' className='block text-blue-600 hover:underline'>
											Platform Documentation →
										</Link>
										<Link href='/dashboard' className='block text-blue-600 hover:underline'>
											Decision Dashboard →
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</ManiLayout>
		</div>
	);
}
