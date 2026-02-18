import React from 'react';
import Link from 'next/link';
import './buttons.css';
export default function Button({ item }: { item: { href: string; label: string } }) {
	return (
		<div className=''>
			<Link key={item.href} href={item.href} className='log-button'>
				{item.label}
			</Link>
		</div>
	);
}
