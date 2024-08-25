'use client';

import { Provider } from 'urql';

import client from '@/config/client';

// TODO: Fix any type
type ProvidersProps = {
	children: any;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	return <Provider value={client}>{children}</Provider>;
};

export default Providers;
