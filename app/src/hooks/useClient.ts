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
				exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
			}),
		[accessToken]
	);

	return client;
};

export default useClient;
