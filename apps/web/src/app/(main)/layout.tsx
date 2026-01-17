'use client';

import React from 'react';
import MainNavigation from '@/components/main/MainNavigation';
import AuthDrawer from '@/components/AuthDrawer';
import { useAuthRefreshQuery } from '@/data/queries';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { isFetched } = useAuthRefreshQuery();

	if (!isFetched) {
		return null;
	}

	return (
		<div>
			<MainNavigation />
			<div className='max-w-6xl mx-auto sm:pt-24 pb-18 sm:pb-0 px-4 pt-32'>
				{children}
			</div>
			<AuthDrawer />
		</div>
	);
};

export default MainLayout;
