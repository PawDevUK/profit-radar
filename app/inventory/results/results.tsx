import React from 'react';

interface ResultsProps {
	children: string[];
}

export default function Results({ children }: ResultsProps) {
	return (
		<div className='mx-1'>
			<h1>Results</h1>
			<h3>{children.length} results found</h3>
			{children.map((car: string, i: number) => {
				return <div key={i}>{car}</div>;
			})}
		</div>
	);
}
