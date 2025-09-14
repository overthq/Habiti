'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import MainNavigation from '@/components/main/MainNavigation';
import { useAuthStore } from '@/state/auth-store';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { accessToken } = useAuthStore();
	const router = useRouter();

	// FIXME: This is a very bad solution for authentication.
	React.useEffect(() => {
		if (!accessToken) {
			router.push('/');
		}
	}, [accessToken]);

	return (
		<div>
			<MainNavigation />
			<div className='container mx-auto'>{children}</div>
		</div>
	);
};

export default MainLayout;
