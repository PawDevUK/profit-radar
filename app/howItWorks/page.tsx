// components/HowItWorks.tsx
import Link from 'next/link';

export default function HowItWorks() {
	return (
		<section className='bg-white py-16 md:py-20 lg:py-24'>
			<div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
				{/* Heading */}
				<div className='text-center'>
					<h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl'>How it Works</h2>
				</div>

				{/* Main content grid */}
				<div className='mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center'>
					{/* Left - Text + CTA */}
					<div className='space-y-8 lg:space-y-10'>
						<div className='space-y-5'>
							<h3 className='text-2xl font-bold text-blue-600 sm:text-3xl'>
								Discover 500,000+ Vehicles for Sale
								<br />
								In All Conditions
							</h3>

							<p className='text-lg leading-relaxed text-gray-700'>
								Copart connects buying Members and sellers of all types of vehicles in all conditions through our{' '}
								<span className='font-semibold'>100% online auction platform</span>. You’ll also find tools to check out, bid on, pay for, and receive the vehicles
								that meet your needs.
							</p>

							<p className='text-lg leading-relaxed text-gray-700'>
								We hold regular auctions at our <span className='font-semibold'>275+ Locations</span> in 11 countries, and national
								<span className='font-semibold'> spotlight auctions</span> that make it easy to find a specific type of vehicle.
							</p>
						</div>

						{/* CTA Button */}
						<div>
							<Link
								href='/inventory'
								className='inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors'>
								Shop Our Inventory
							</Link>
						</div>
					</div>

					{/* Right - Images grid */}
					<div className='grid grid-cols-2 gap-4 sm:gap-6'>
						{/* Image 1 - Inspector / Tablet */}
						<div className='aspect-[4/3] overflow-hidden rounded-xl shadow-lg'>
							<img
								src='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
								alt='Inspector checking vehicle with tablet'
								className='h-full w-full object-cover'
								loading='lazy'
							/>
						</div>

						{/* Image 2 - Tow truck / Sports car */}
						<div className='aspect-[4/3] overflow-hidden rounded-xl shadow-lg'>
							<img
								src='https://images.unsplash.com/photo-1502877338535-766e3a6052c0?auto=format&fit=crop&q=80'
								alt='Tow truck loading red sports car'
								className='h-full w-full object-cover'
								loading='lazy'
							/>
						</div>

						{/* Image 3 - Large lot overview (spans both columns) */}
						<div className='col-span-2 aspect-[16/9] overflow-hidden rounded-xl shadow-lg'>
							<img
								src='https://images.unsplash.com/photo-1506529134274-9a26lienss?auto=format&fit=crop&q=80'
								alt='Huge vehicle auction lot with thousands of cars'
								className='h-full w-full object-cover'
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
