'use client';

import React from 'react';
import MainNavigation from '@/components/main/MainNavigation';
import MobileTabBar from '@/components/main/MobileTabBar';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div>
			<MainNavigation />
			<div className='max-w-6xl mx-auto sm:pt-24 pb-18 px-4 pt-20'>
				{children}
			</div>
			<MobileTabBar />
		</div>
	);
};

export default MainLayout;
