import React from 'react';

interface ExSquareIconProps extends React.SVGProps<SVGSVGElement> {
	size?: number | string;
}

export const ExSquareIcon: React.FC<ExSquareIconProps> = ({ size = 24, stroke = 'currentColor', strokeWidth = 2, ...props }) => {
	// Maintaining the 25:24 aspect ratio based on the custom width you requested
	const width = size;
	const height = typeof size === 'number' ? (size * 24) / 25 : size;

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 25 24'
			fill='none'
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<rect width='19' height='18' x='3' y='3' rx='2' />
			<text
				x='12.5'
				y='12'
				fontFamily='sans-serif'
				fontSize='10'
				fontWeight='600'
				fill={stroke} /* Matches the text color to the stroke color */
				textAnchor='middle'
				dominantBaseline='central'
				letterSpacing='0.8'
				strokeWidth={0} /* Prevents the stroke-width from blowing up the text thickness */
			>
				EX
			</text>
		</svg>
	);
};

export default ExSquareIcon;
