'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/config/client';
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

	// FIXME: This is not a good way to handle authentication.
	React.useEffect(() => {
		if (userId && accessToken) {
			if (pathname === '/') {
				router.replace('/home');
			} else {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	}, [userId, accessToken, router, pathname]);

	if (loading) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

export default Providers;
