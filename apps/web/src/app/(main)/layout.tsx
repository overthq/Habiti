'use client';

import React from 'react';
import { refreshToken } from '@/data/requests';
import MainNavigation from '@/components/main/MainNavigation';
import MobileTabBar from '@/components/main/MobileTabBar';
import { useAuthStore } from '@/state/auth-store';
import AuthDrawer from '@/components/AuthDrawer';

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
			<div className='max-w-6xl mx-auto sm:pt-24 pb-18 sm:pb-0 px-4 pt-32'>
				{children}
			</div>
			<AuthDrawer />
		</div>
	);
};

export default MainLayout;
