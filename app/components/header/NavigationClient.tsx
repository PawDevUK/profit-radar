'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../lib/auth';
import SearchBar from '@/app/components/header/search';
import LogButton from '../common/buttons/logButton';
import NavButton from '../common/buttons/NavButton';

export default function NavigationClient() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	interface User {
		fullName?: string;
		// Add other properties as needed
	}

	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Check login status on mount
		// setIsLoggedIn(authService.isLoggedIn());
		// setCurrentUser(authService.getCurrentUser());

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

	const handleLogout = () => {
		authService.logout();
		setIsLoggedIn(false);
		setCurrentUser(null);
		router.push('/');
	};

	const handleClose = () => {
		setMobileOpen(false);
	};

	const menuItems = [
		{ href: '/howItWorks', label: 'How it works' },
		{ href: '/inventory', label: 'Inventory' },
		{ href: '/auctions', label: 'Auctions' },
		{ href: '/locations', label: 'Locations' },
		{ href: '/sell-your-car', label: 'Sell your car' },
		{ href: '/services-support', label: 'Services & support' },
	];

	const authItems = [
		{ href: '/signin', label: 'Sign In' },
		{ href: '/signup', label: 'Sign Up' },
	];

	return (
		<header className='bg-mongo shadow-sm border-b border-gray-200 mainPadding mx-auto'>
			{/* Top Bar */}
			<div className=' text-gray-700 px-4 pt-2 pb-5'>
				<div className='mx-auto flex flex-col items-center justify-between text-sm  pt-3'>
					{/* Mobile menu button */}
					<div className='flex *:items-center justify-between w-full mb-5'>
						<div className='space-x-4'>
							<Link href='/' className='text-3xl font-bold text-gray-700 md:hidden'>
								Profit<span className='text-(--mongo-green) ml-2'>Radar</span>
							</Link>
						</div>
						<div className='md:hidden'>
							<button type='button' onClick={() => setMobileOpen(!mobileOpen)} className='text-gray-700 hover:text-gray-900 py-2 flex flex-row'>
								<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
								</svg>
								<span className='ml-1 text-sm font-medium flex items-center '>
									<p>Menu</p>
								</span>
							</button>
						</div>
					</div>
					{/* Desktop logo and search bar */}
					<div className='flex flex-row w-full'>
						<Link href='/' className='text-3xl font-bold text-gray-700 hidden md:block'>
							Profit<span className='text-(--mongo-green) ml-2'>Radar</span>
						</Link>
						<SearchBar></SearchBar>
						<div className='flex flex-row space-x-4 hidden md:flex'>
							{authItems.map((item, i) => (
								<div key={i} className='w-30'>
									<LogButton item={item} onclick={handleClose} />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Main Navigation */}
			<nav className='mx-auto px-4'>
				<div className='flex justify-center items-center'>
					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center '>
						{menuItems.map((item) => (
							<NavButton key={item.href} item={item} />
						))}
					</div>
				</div>

				{/* Mobile Menu */}
				<div
            className={`md:hidden overflow-hidden border-t border-gray-200 transition-all duration-500 ease-in-out ${mobileOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
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
						{menuItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setMobileOpen(false)}
								className='block text-gray-700 px-3 py-2 text-sm font-medium hover:bg-[#EAE2D0] rounded-[5px]'>
								{item.label}
							</Link>
						))}
						{!isLoggedIn && (
							<div className='flex mt-5 flex-col space-y-4 justify-center items-center'>
								{authItems.map((item, i) => (
									<div key={i} className='w-70'>
										<LogButton item={item} onclick={handleClose} />
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
