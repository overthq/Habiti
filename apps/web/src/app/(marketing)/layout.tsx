'use client';

import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface MarketingLayoutProps {
	children: React.ReactNode;
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
	return (
		<main className='flex flex-col h-screen'>
			<Header />
			{children}
			<Footer />
		</main>
	);
};

export default MarketingLayout;
