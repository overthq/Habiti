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
			<div className='container mx-auto'>{children}</div>
		</div>
	);
};

export default MainLayout;
