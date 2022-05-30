import React from 'react';
import { createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import env from '../../env';
import useStore from '../state';

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
						'x-market-store-id': activeStore || ''
					}
				}),
				exchanges: [
					dedupExchange,
					cacheExchange({
						keys: {
							OrderProduct: data => `${data.orderId}-${data.productId}`,
							StoreManager: data => `${data.storeId}-${data.managerId}`
						}
					}),
					fetchExchange,
					multipartFetchExchange
				]
			}),
		[accessToken, activeStore]
	);

	return client;
};

export default useClient;
