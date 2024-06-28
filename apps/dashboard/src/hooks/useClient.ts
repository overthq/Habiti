import React from 'react';
import { createClient, fetchExchange } from 'urql';

import env from '../../env';
import useStore from '../state';
import customCache from '../utils/cache';

const useClient = () => {
	const { accessToken, activeStore } = useStore(state => ({
		accessToken: state.accessToken,
		activeStore: state.activeStore
	}));

	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
				fetchOptions: () => ({
					headers: {
						authorization: accessToken ? `Bearer ${accessToken}` : '',
						// FIXME: This is inherently insecure. We have to either:
						// - Add the storeId to the accessToken before signing, or
						// - Add access control checks on the server.
						'x-market-store-id': activeStore ?? ''
					}
				}),
				exchanges: [customCache, fetchExchange]
			}),
		[accessToken, activeStore]
	);

	return client;
};

export default useClient;
