'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/config/client';
import { refreshToken } from '@/data/requests';
import { useAuthStore } from '@/state/auth-store';
import { useRouter } from 'next/navigation';

type ProvidersProps = {
	children: React.ReactNode;
};

const ProvidersInner = ({ children }: ProvidersProps) => {
	const { accessToken, logIn } = useAuthStore();
	const [loading, setLoading] = React.useState(true);
	const router = useRouter();

	// TODO: Find a way to handle this cleanly without depending on the `useEffect` crutch.
	React.useEffect(() => {
		const initAuth = async () => {
			if (!accessToken) {
				try {
					const { accessToken } = await refreshToken();

					logIn({ accessToken });

					router.push('/home');
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

	return children;
};

const Providers = ({ children }: ProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ProvidersInner>{children}</ProvidersInner>
		</QueryClientProvider>
	);
};

export default Providers;
