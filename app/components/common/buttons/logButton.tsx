import React from 'react';
import Link from 'next/link';
import './buttons.css';
export default function LogButton({ item, onclick }: { item: { href: string; label: string; fontSize?: number }; onclick?: () => void }) {
	return (
		<div className=''>
			<Link
				key={item.href}
				href={item.href}
				className="log-button"
				style={item.fontSize ? { fontSize: `${item.fontSize}px` } : undefined}
			>
				<button onClick={onclick}>{item.label}</button>
			</Link>
		</div>
	);
}
