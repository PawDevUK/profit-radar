import type { Metadata } from 'next';
import Navigation from './components/header/NavigationClient';
import Footer from './components/footer/footer';
import './globals.css';
import './components/common/buttons/buttons.css';

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
			<body suppressHydrationWarning>
				<Navigation />

				{/* Main Content */}
				<main className='min-h-screen'>{children}</main>

				{/* Footer */}
				<Footer></Footer>
			</body>
		</html>
	);
}
