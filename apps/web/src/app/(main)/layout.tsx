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
			<div className='max-w-4xl mx-auto sm:pt-24 pb-8 px-4 pt-16'>
				{children}
			</div>
			<MobileTabBar />
		</div>
	);
};

export default MainLayout;
