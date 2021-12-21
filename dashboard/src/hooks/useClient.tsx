import React from 'react';
import { createClient, dedupExchange, cacheExchange } from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { useAppSelector } from '../redux/store';
import env from '../../env';

const useClient = () => {
	const { accessToken, activeStore } = useAppSelector(
		({ auth, preferences }) => ({
			accessToken: auth.accessToken,
			activeStore: preferences.activeStore
		})
	);

	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
				fetchOptions: () => ({
					headers: {
						authorization: accessToken ? `Bearer ${accessToken}` : '',
						'x-market-store-id': activeStore || ''
					}
				}),
				exchanges: [dedupExchange, cacheExchange, multipartFetchExchange]
			}),
		[accessToken, activeStore]
	);

	return client;
};

export default useClient;
