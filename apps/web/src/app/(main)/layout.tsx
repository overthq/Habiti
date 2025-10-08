'use client';

import React from 'react';
import MainNavigation from '@/components/main/MainNavigation';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div>
			<MainNavigation />
			<div className='max-w-4xl mx-auto pt-20 pb-8 px-4'>{children}</div>
		</div>
	);
};

export default MainLayout;
