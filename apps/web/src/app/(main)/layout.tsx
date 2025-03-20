'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import MainNavigation from '@/components/main/MainNavigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface MainLayoutProps {
	children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	const { loading, loggedIn } = useAuthContext();
	const router = useRouter();

	// FIXME: This is a very bad solution for authentication.
	React.useEffect(() => {
		if (!loading && !loggedIn) {
			router.push('/');
		}
	}, [loading, loggedIn]);

	if (loading) {
		return <div />;
	}

	return (
		<div>
			<MainNavigation />
			<div className='container mx-auto'>{children}</div>
		</div>
	);
};

export default MainLayout;
