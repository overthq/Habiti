'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/config/client';
import { refreshToken } from '@/data/requests';
import { useAuthStore } from '@/state/auth-store';

type ProvidersProps = {
	children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
	const { accessToken } = useAuthStore();
	const [loading, setLoading] = React.useState(true);

	// TODO: Find a way to handle this cleanly without depending on the `useEffect` crutch.
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

	if (loading) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default Providers;
