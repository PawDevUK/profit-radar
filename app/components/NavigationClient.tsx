'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/auth';

type Platform = {
	_id: string;
	name: string;
};

type NavigationClientProps = {
	platforms: Platform[];
};

export default function NavigationClient({ platforms }: NavigationClientProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useEffect(() => {
		// Check login status on mount
		setIsLoggedIn(authService.isLoggedIn());
		setCurrentUser(authService.getCurrentUser());

		// Listen for auth state changes
		const handleAuthChange = (event: Event) => {
			const customEvent = event as CustomEvent;
			setIsLoggedIn(customEvent.detail.isLoggedIn);
			setCurrentUser(customEvent.detail.user);
		};

		// Listen for storage changes (cross-tab)
		const handleStorageChange = () => {
			setIsLoggedIn(authService.isLoggedIn());
			setCurrentUser(authService.getCurrentUser());
		};

		window.addEventListener('authStateChanged', handleAuthChange);
		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('authStateChanged', handleAuthChange);
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		authService.logout();
		setIsLoggedIn(false);
		setCurrentUser(null);
		router.push('/');
	};

	const menuItems = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/notifications', label: 'Notifications' },
		{ href: '/payables', label: 'Payables' },
		{ href: '/documentation', label: 'Documentation' },
		{ href: '/api', label: 'Api Connect' },
	];

	const authItems = [
		{ href: '/signin', label: 'Sign In' },
		{ href: '/signup', label: 'Sign Up' },
	];

	return (
		<header className='bg-amazon shadow-sm border-b border-gray-200 mainPadding mx-auto'>
			{/* Top Bar */}
			<div className='bg-amazon text-gray-700 px-4 py-2'>
				<div className='mx-auto flex items-center justify-between text-sm px-4 pt-3'>
					<div className='space-x-4'>
						<span className='sr-only'>Skip to main content</span>
						<Link href='/' className='text-3xl font-bold text-gray-700 hidden md:block'>
							Fetch<span className='text-[#FF6200]'>y</span>
						</Link>
					</div>
					<div className='hidden md:flex items-center space-x-4'>
						{isLoggedIn ? (
							<div className='flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition-all'>
								<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold'>
									{currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
								</div>
								<div className='flex flex-col'>
									<span className='text-gray-700 text-sm font-medium'>{currentUser?.fullName || 'User'}</span>
									<button onClick={handleLogout} className='text-green-600 text-xs font-semibold hover:text-green-800 transition-colors text-left'>
										Log Out
									</button>
								</div>
							</div>
						) : (
							authItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className='flex items-center justify-center text-gray-700 border border-black hover:border-[#FF6200] px-8 rounded-full text-sm font-medium hover:bg-[#EAE2D0] hover:text-[#FF6200] hover:shadow-lg transition-all bg-transparent h-10'>
									{item.label}
								</Link>
							))
						)}
					</div>
				</div>
			</div>

			{/* Main Navigation */}
			<nav className='mx-auto px-4'>
				<div className='flex justify-center items-center h-14'>
					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-3'>
						<div className='relative' ref={dropdownRef}>
							<div
								onClick={() => setIsOpen(!isOpen)}
								className='flex items-center text-gray-700 hover:text-[#FF6200] hover:bg-[#EAE2D0] hover:shadow-lg px-3 py-2 text-lg font-medium cursor-pointer rounded-[5px] transition-all'>
								Platforms
								<svg className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</div>
							<div
								className={`absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg transition-opacity duration-200 z-10 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
								{platforms.length > 0 ? (
									platforms.map((platform) => (
										<Link key={platform._id} href={`/platform/${platform._id}`} className='block px-4 py-2 text-md text-gray-700 hover:bg-[#EAE2D0]'>
											{platform.name}
										</Link>
									))
								) : (
									<div className='px-4 py-2 text-sm text-gray-500'>No platforms available</div>
								)}
							</div>
						</div>

						{menuItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className='text-gray-700 hover:text-[#FF6200] px-3 py-2 text-lg font-medium hover:bg-[#EAE2D0] hover:shadow-lg rounded-[5px] transition-all'>
								{item.label}
							</Link>
						))}
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<button type='button' onClick={() => setMobileOpen(!mobileOpen)} className='text-gray-700 hover:text-gray-900 p-2'>
							<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				<div className={`md:hidden ${mobileOpen ? 'block' : 'hidden'} border-t border-gray-200`}>
					<div className='px-4 py-4 space-y-1'>
						{isLoggedIn && (
							<div className='mb-4 flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition-all'>
								<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm'>
									{currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
								</div>
								<div className='flex flex-col'>
									<span className='text-gray-700 text-sm font-medium'>{currentUser?.fullName || 'User'}</span>
									<button onClick={handleLogout} className='text-green-600 text-xs font-semibold hover:text-green-800 transition-colors text-left'>
										Log Out
									</button>
								</div>
							</div>
						)}
						<div>
							<div onClick={() => setIsOpen(!isOpen)} className='flex items-center text-gray-700 px-3 py-2 text-sm font-medium w-full text-left cursor-pointer'>
								Platforms
								<svg className={`ml-1 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</div>
							<div className={`${isOpen ? 'block' : 'hidden'} ml-4 space-y-2`}>
								{platforms.length > 0 ? (
									platforms.map((platform) => (
										<Link key={platform._id} href={`/platform/${platform._id}`} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
											{platform.name}
										</Link>
									))
								) : (
									<div className='px-4 py-2 text-sm text-gray-500'>No platforms</div>
								)}
							</div>
						</div>
						{menuItems.map((item) => (
							<Link key={item.href} href={item.href} className='block text-gray-700 px-3 py-2 text-sm font-medium hover:bg-[#EAE2D0] rounded-[5px]'>
								{item.label}
							</Link>
						))}
						{!isLoggedIn && (
							<div className='flex mt-5 space-x-4 justify-center flex-col'>
								{authItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className='flex items-center justify-center text-gray-700 border border-black hover:border-[#FF6200] px-8 rounded-full text-sm font-medium hover:bg-[#EAE2D0] hover:text-[#FF6200] hover:shadow-lg transition-all bg-transparent h-10'>
										{item.label}
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
