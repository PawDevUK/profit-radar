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
		<button
			type='button'
			onClick={handleClick}
			className={`
        relative flex h-7 w-14 items-center rounded-full p-1 transition-colors
        ${isOn ? 'bg-[var(--mongo-green)]' : 'bg-gray-300'}
      `}
			role='switch'
			aria-checked={isOn}>
			{/* Background icons (faded) */}
			<div className='absolute inset-0 flex items-center justify-between px-2 text-sm font-bold'>
				<span className={'text-white/40'}>×</span>
				<span className={isOn ? 'text-teal-900/70' : 'text-gray-500/40'}>✓</span>
			</div>

			{/* Knob */}
			<div
				className={`
          relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white
          shadow-md transition-transform duration-200
          ${isOn ? 'translate-x-7' : 'translate-x-0'}
        `}>
				<span className='text-sm text-gray-900 leading-none'>{isOn ? '✓' : '×'}</span>
			</div>
		</button>
	);
}

// ────────────────────────────────────────────────
// Usage:
