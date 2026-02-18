// components/HowItWorks.tsx
import Link from 'next/link';
import Image from 'next/image';
import { bmw535, tiguan, chargergt } from '@/img';

export default function HowItWorks() {
	return (
		<div>
			<section className='bg-white py-6 md:py-8 lg:py-4'>
				<div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
					{/* Heading */}

					{/* Main content grid */}
					<div className='mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center'>
						<div className='space-y-8 lg:space-y-10'>
							<div className=''>
								<h2 className='text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl lg:text-5xl'>How it Works</h2>
							</div>
							<div className='space-y-5'>
								<h3 className='text-2xl font-bold text-blue-600 sm:text-3xl'>
									Discover 500,000+ Vehicles for Sale
									<br />
									In All Conditions
								</h3>

								<p className='text-lg leading-relaxed text-gray-700'>
									Profit Radar connects buying Members and sellers of all types of vehicles in all conditions through our{' '}
									<span className='font-semibold'>100% online auction platform</span>. You’ll also find tools to check out, bid on, pay for, and receive the
									vehicles that meet your needs.
								</p>

								<p className='text-lg leading-relaxed text-gray-700'>
									We hold regular auctions at our <span className='font-semibold'>275+ Locations</span> in 11 countries, and national
									<span className='font-semibold'> spotlight auctions</span> that make it easy to find a specific type of vehicle.
								</p>
								<div>
									<Link
										href='/inventory'
										className='inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors'>
										Shop Our Inventory
									</Link>
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
					<div className='space-y-5'>
						<h3 className='text-2xl font-bold text-blue-600 sm:text-3xl'>Get Started</h3>
						<p className='text-lg leading-relaxed text-gray-700'>
							Register for an account, then purchase a Basic or Premier Membership. You can get a full refund for up to seven days if you change your mind as long as
							you don’t use your Member benefits*, so it’s risk free.
						</p>
						<Link
							href='/signup'
							className='inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors'>
							Register Now
						</Link>
					</div>
				</div>
			</section>
			<section className='bg-white pt-6 md:pt-8 pb-6 md:pb-8'>
				<div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
					{/* Heading */}
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-bold tracking-tight text-blue-600 sm:text-3xl'>After You&#39;ve Registered:</h2>
						<p className='mt-4 text-lg text-gray-600'>
							Credentials to buy a vehicle in a specific state, search for No License Required vehicles or work with a Broker.
						</p>
					</div>

					{/* Three-column grid */}
					<div className='grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12'>
						{/* Column 1: Upload License & Join Auctions */}
						<div className='space-y-10'>
							{/* Upload License(s) */}
							<div className='text-center md:text-left'>
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
								<h3 className='text-xl font-semibold text-blue-600'>Upload License(s)</h3>
								<p className='mt-3 text-gray-600'>
									Scan a government-issued ID and upload any business licenses required in states where you want to buy vehicles.
								</p>
								<div className='mt-4 space-y-1 text-sm'>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Document Uploader →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										State Licensing Overview →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Limited Power of Attorney →
									</Link>
								</div>
							</div>

							{/* Join Auctions */}
							<div className='text-center md:text-left'>
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
								<h3 className='text-xl font-semibold text-blue-600'>Join Auctions</h3>
								<p className='mt-3 text-gray-600'>
									Join the fun and action of our live auctions under the options in the Auctions tab, like Today&#39;s Auctions, Auction Calendar and Join An
									Auction.
								</p>
								<div className='mt-4 space-y-1 text-sm'>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Auction Calendar →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Today&apos;s Auctions →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Join An Auction →
									</Link>
								</div>
							</div>
						</div>

						{/* Column 2: No License & Other Ways */}
						<div className='space-y-10'>
							{/* No License Is No Problem */}
							<div className='text-center md:text-left'>
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
								<h3 className='text-xl font-semibold text-blue-600'>No License Is No Problem</h3>
								<p className='mt-3 text-gray-600'>
									If you don&apos;t have a dealer&apos;s license or other required credentials to buy a vehicle in a specific state, search for No License
									Required vehicles or work with a Broker.
								</p>
								<div className='mt-4 space-y-1 text-sm'>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Broker →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										No License Required →
									</Link>
								</div>
							</div>

							{/* Other Ways to Win */}
							<div className='text-center md:text-left'>
								<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
									{/* Gavel / Bid Icon placeholder */}
									<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' />
									</svg>
								</div>
								<h3 className='text-xl font-semibold text-blue-600'>Other Ways to Win</h3>
								<p className='mt-3 text-gray-600'>
									Set a Max Bid and our system will incrementally bid for you up to your top price. Purchase Buy It Now vehicles... or make counteroffers with
									Make An Offer.
								</p>
								<div className='mt-4 space-y-1 text-sm'>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Max Bids →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Buy It Now →
									</Link>
								</div>
							</div>
						</div>

						{/* Column 3: Search & Receive */}
						<div className='space-y-10'>
							{/* Search, Save & Set Alerts */}
							<div className='text-center md:text-left'>
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
								<h3 className='text-xl font-semibold text-blue-600'>Search, Save & Set Alerts</h3>
								<p className='mt-3 text-gray-600'>
									Search & filter our huge selection to find the vehicles that fit your needs. Save your common searches. Track vehicles... and set Vehicle
									Alerts.
								</p>
								<div className='mt-4 space-y-1 text-sm'>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Vehicle Finder Tool →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Set a Vehicle Alert →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Save a Search →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Watchlist →
									</Link>
								</div>
							</div>

							{/* Receive Your Vehicles */}
							<div className='text-center md:text-left'>
								<div className='mx-auto md:mx-0 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
									{/* Truck Delivery Icon */}
									<svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
									</svg>
								</div>
								<h3 className='text-xl font-semibold text-blue-600'>Receive Your Vehicles</h3>
								<p className='mt-3 text-gray-600'>Order delivery through Copart, dispatch your own transporter, or pick vehicles up in person.</p>
								<div className='mt-4 space-y-1 text-sm'>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Payment & Pickup →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										International Delivery →
									</Link>
									<Link href='#' className='block text-blue-600 hover:underline'>
										Domestic Delivery →
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
