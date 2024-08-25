import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Habiti',
	description: 'Simplifying online shopping'
};

interface RootLayoutProps {
	children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
