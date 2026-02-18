import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Navigation from './components/header/NavigationClient';
import './globals.css';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Profit Radar',
	description: 'Automated auction monitoring and analytics for savvy resellers.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' />
			</head>
			<body className={roboto.className}>
				<Navigation />

				{/* Main Content */}
				<main className='min-h-screen  mx-auto px-4'>{children}</main>

				{/* Footer */}
				<footer className='bg-mongo text-gray-700 py-8'>
					<div className=' mx-auto px-4'>
						<div className='text-center'>
							<p className=' text-sm'>© 2026 Profit Radar. All rights reserved.</p>
						</div>
					</div>
				</footer>
			</body>
		</html>
	);
}
