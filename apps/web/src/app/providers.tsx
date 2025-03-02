'use client';

import React from 'react';
import { Provider } from 'urql';

import { generateClient } from '@/config/client';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';

type ProvidersProps = {
	children: React.ReactNode;
};

const WrappedProviders = ({ children }: ProvidersProps) => {
	const { accessToken } = useAuthContext();

	const client = React.useMemo(() => {
		return generateClient(accessToken);
	}, [accessToken]);

	return <Provider value={client}>{children}</Provider>;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	return (
		<AuthProvider>
			<WrappedProviders>{children}</WrappedProviders>
		</AuthProvider>
	);
};

export default Providers;
