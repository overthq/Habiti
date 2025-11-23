'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/config/client';
import { refreshToken } from '@/data/requests';
import { useAuthStore } from '@/state/auth-store';
import { usePathname, useRouter } from 'next/navigation';

type ProvidersProps = {
	children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
	const { userId, accessToken } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();

	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const initAuth = async () => {
			if (!accessToken) {
				try {
					const { accessToken: newAccessToken, userId: newUserId } =
						(await refreshToken()) as any;
					useAuthStore.getState().logIn({
						accessToken: newAccessToken,
						userId: newUserId
					});
				} catch (error) {
					// Failed to refresh, user is not logged in
				}
			}
			setLoading(false);
		};

		initAuth();
	}, [accessToken]);

	React.useEffect(() => {
		if (!loading && !userId && pathname !== '/' && pathname !== '/auth/login') {
			// Optional: Redirect to login if needed, but maybe let pages handle it
		}
	}, [loading, userId, pathname, router]);

	if (loading) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default Providers;
