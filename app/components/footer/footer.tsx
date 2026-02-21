import React from 'react';

export default function Footer() {
	return (
		<footer
			className='py-8 border border-gray-200 shadow-lg'
			style={{ background: 'linear-gradient(to right, var(--background-mongo) 0%, var(--background-mongo) 40%, var(--mongo-green) 100%)' }}>
			<div className='mx-auto px-4'>
				<div className='text-center'>
					<p className=' footer-header'>© 2026 Profit Radar. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
