'use client';

import React from 'react';
import { refreshToken } from '@/data/requests';
import MainNavigation from '@/components/main/MainNavigation';
import MobileTabBar from '@/components/main/MobileTabBar';
import { useAuthStore } from '@/state/auth-store';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { accessToken } = useAuthStore();
	const [loading, setLoading] = React.useState(true);

	// TODO: Find a way to handle this cleanly without depending on the `useEffect` crutch.
	React.useEffect(() => {
		const initAuth = async () => {
			if (!accessToken) {
				try {
					await refreshToken();
				} catch (error) {
					// Failed to refresh, user is not logged in
				}
			}
			setLoading(false);
		};

		initAuth();
	}, [accessToken]);

	if (loading) {
		return null;
	}

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
