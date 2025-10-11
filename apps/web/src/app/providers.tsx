'use client';

import React from 'react';
import { Provider } from 'urql';
import { QueryClientProvider } from '@tanstack/react-query';

import { generateClient, queryClient } from '@/config/client';
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

	const client = React.useMemo(
		() => generateClient(accessToken),
		[accessToken]
	);

	if (loading) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Provider value={client}>{children}</Provider>
		</QueryClientProvider>
	);
};

export default Providers;
