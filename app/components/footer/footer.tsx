import React from 'react';
import { urbanCamo } from '@/img/index';

export default function Footer() {
	return (
		<footer
			className='py-8 border border-gray-200 shadow-lg'
			style={{
				background: `url(${urbanCamo.src}) center/cover, var(--background-mongo)`,
			}}>
			<div className='mx-auto px-4'>
				<div className='text-center'>
					<p className='footer-header'>© 2026 Profit Radar. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
