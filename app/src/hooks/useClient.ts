import React from 'react';
import { createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import env from '../../env';

const useClient = (accessToken: string | null) => {
	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
				fetchOptions: {
					headers: { authorization: `Bearer ${accessToken}` }
				},
				exchanges: [
					dedupExchange,
					cacheExchange({
						keys: {
							StoreFollower: data => `${data.storeId}-${data.followerId}`,
							OrderProduct: data => `${data.orderId}-${data.productId}`,
							CartProduct: data => `${data.cartId}-${data.productId}`
						}
					}),
					fetchExchange
				]
			}),
		[accessToken]
	);

	return client;
};

export default useClient;
