'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/auth';

export default function SignUpPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [terms, setTerms] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match!');
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		// Attempt registration
		const success = authService.register(fullName, email, password);

		if (success) {
			// Auto-login after successful registration
			authService.login(email, password);
			// Redirect to dashboard
			router.push('/dashboard');
		} else {
			setError('Email already registered. Please sign in instead.');
			setIsLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center mainWrapper min-h-screen bg-gray-50 text-gray-600 pt-20'>
			<div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
				{error && <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{error}</div>}
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label htmlFor='fullname' className='block text-sm font-medium text-gray-700'>
							Full Name
						</label>
						<div className='mt-1'>
							<input
								id='fullname'
								name='fullname'
								type='text'
								required
								autoComplete='name'
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
							Email address
						</label>
						<div className='mt-1'>
							<input
								id='email'
								name='email'
								type='email'
								required
								autoComplete='email'
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
							Password
						</label>
						<div className='mt-1 relative'>
							<input
								id='password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								required
								autoComplete='new-password'
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'>
								{showPassword ? <i className='fa-solid fa-eye'></i> : <i className='fa-solid fa-eye-slash'></i>}
							</button>
						</div>
					</div>
					<div>
						<label htmlFor='confirm-password' className='block text-sm font-medium text-gray-700'>
							Confirm Password
						</label>
						<div className='mt-1 relative'>
							<input
								id='confirm-password'
								name='confirm-password'
								type={showPassword ? 'text' : 'password'}
								required
								autoComplete='new-password'
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'>
								{showPassword ? <i className='fa-solid fa-eye'></i> : <i className='fa-solid fa-eye-slash'></i>}
							</button>
						</div>
					</div>
					<div>
						<button
							type='submit'
							disabled={isLoading}
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'>
							{isLoading ? 'Creating account...' : 'Sign up'}
						</button>
					</div>
				</form>
				<div>
					<div className='relative mt-6'>
						<div className='absolute inset-0 flex items-center' aria-hidden='true'>
							<div className='w-full border-t border-gray-300'></div>
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-white text-gray-500'>Or continue with</span>
						</div>
					</div>
					<div className='mt-6 grid grid-cols-2 gap-3'>
						<a
							href='#'
							className='flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
							<span className='text-sm font-medium'>Google</span>
						</a>
						<a
							href='#'
							className='flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
							<span className='text-sm font-medium'>Facebook</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
