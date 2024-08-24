'use client';

import { Provider } from 'urql';

import client from '@/config/client';

type ProvidersProps = {
	// TODO: Fix any type
	children: any;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	return <Provider value={client}>{children}</Provider>;
};

export default Providers;
