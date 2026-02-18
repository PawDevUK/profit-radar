import React from 'react';
import Link from 'next/link';

export default function NavButton({ item }: { item: { href: string; label: string } }) {
	return (
		<div className=''>
			<Link key={item.href} href={item.href} className='nav-button'>
				{item.label}
			</Link>
		</div>
	);
}
