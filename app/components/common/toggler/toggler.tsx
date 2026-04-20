'use client';

import { useEffect, useState } from 'react';

type ToggleProps = {
	enabled?: boolean;
	onChange?: (enabled: boolean) => void;
	size?: number;
	colour?: string;
};

export default function Toggle({ enabled = false, onChange, size, colour }: ToggleProps) {
	const [isOn, setIsOn] = useState(enabled);
	const scale = typeof size === 'number' && size > 0 ? size : 1;

	useEffect(() => {
		setIsOn(enabled);
	}, [enabled]);

	const dimensions = {
		wrapperWidth: 40 * scale,
		trackHeight: 19 * scale,
		trackWidth: 39 * scale,
		trackPadding: 1 * scale,
		iconPaddingX: 6 * scale,
		iconFontSize: 13 * scale,
		knobSize: 17 * scale,
		knobTranslateX: 20 * scale,
		knobFontSize: 12 * scale,
	};

	const handleClick = () => {
		const newValue = !isOn;
		setIsOn(newValue);
		onChange?.(newValue);
	};

	return (
		<div className='flex items-center space-x-3 z-100 ' style={{ width: `${dimensions.wrapperWidth}px` }}>
			<button
				type='button'
				onClick={handleClick}
				className={`relative flex items-center rounded-full transition-colors cursor-pointer ${isOn ? `` : 'bg-gray-300'}`}
				style={{
					backgroundColor: isOn ? `var(${colour || '--mongo-green'})` : undefined,
					height: `${dimensions.trackHeight}px`,
					width: `${dimensions.trackWidth}px`,
					padding: `${dimensions.trackPadding}px`,
				}}
				role='switch'
				aria-checked={isOn}>
				<div
					className='relative z-10 flex items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200'
					style={{
						height: `${dimensions.knobSize}px`,
						width: `${dimensions.knobSize}px`,
						transform: `translateX(${isOn ? dimensions.knobTranslateX : 0}px)`,
					}}></div>
			</button>
		</div>
	);
}
