'use client';

import MainNavigation from '@/components/main/MainNavigation';
import React from 'react';

// Ensure that the user is authenticated, or redirect to the login page

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
