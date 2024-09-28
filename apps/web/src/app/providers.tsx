'use client';

import React from 'react';
import { Provider } from 'urql';

import { generateClient } from '@/config/client';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';

type ProvidersProps = {
	children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	const { accessToken } = useAuthContext();

	const client = React.useMemo(() => {
		return generateClient(accessToken);
	}, [accessToken]);

	return (
		<AuthProvider>
			<Provider value={client}>{children}</Provider>
		</AuthProvider>
	);
};

export default Providers;
