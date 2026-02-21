'use client';

import { useState } from 'react';

type ToggleProps = {
	enabled?: boolean;
	onChange?: (enabled: boolean) => void;
};

export default function Toggle({ enabled = false, onChange }: ToggleProps) {
	const [isOn, setIsOn] = useState(enabled);

	const handleClick = () => {
		const newValue = !isOn;
		setIsOn(newValue);
		onChange?.(newValue);
	};

	return (
		<div className='flex items-center space-x-3 w-[40px]'>
			<button
				type='button'
				onClick={handleClick}
				className={`relative flex h-[19px] w-[39px] items-center rounded-full p-[1px] transition-colors ${isOn ? 'bg-[var(--mongo-green)]' : 'bg-gray-300'}`}
				role='switch'
				aria-checked={isOn}>
				{/* Background icons (faded) */}
				<div className='absolute inset-0 flex items-center justify-between px-[6px] text-xs font-bold'>
					<span className={'text-white/40'} style={{ fontSize: '13px' }}>
						×
					</span>
					<span className={isOn ? 'text-teal-900/70' : 'text-gray-500/40'} style={{ fontSize: '13px' }}>
						✓
					</span>
				</div>

				{/* Knob */}
				<div
					className={`relative z-10 flex h-[17px] w-[17px] items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ${isOn ? 'translate-x-[20px]' : 'translate-x-0'}`}>
					<span className='text-xs text-gray-900 leading-none'>{isOn ? '✓' : '×'}</span>
				</div>
			</button>
		</div>
	);
}
