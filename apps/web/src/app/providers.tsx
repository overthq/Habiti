'use client';

import React from 'react';
import { Provider } from 'urql';
import { QueryClientProvider } from '@tanstack/react-query';

import { generateClient, queryClient } from '@/config/client';
import { useAuthStore } from '@/state/auth-store';

type ProvidersProps = {
	children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
	const { accessToken } = useAuthStore();

	const client = React.useMemo(() => {
		return generateClient(accessToken);
	}, [accessToken]);

	return (
		<QueryClientProvider client={queryClient}>
			<Provider value={client}>{children}</Provider>
		</QueryClientProvider>
	);
};

export default Providers;
