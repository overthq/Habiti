import React from 'react';
import { createClient, dedupExchange, fetchExchange } from 'urql';
import env from '../../env';
import customCache from '../utils/cache';

const useClient = (accessToken: string | null) => {
	const client = React.useMemo(
		() =>
			createClient({
				url: `${env.apiUrl}/graphql`,
				fetchOptions: {
					headers: {
						...(accessToken ? { authorization: `Bearer ${accessToken}` } : {})
					}
				},
				exchanges: [dedupExchange, customCache, fetchExchange]
			}),
		[accessToken]
	);

	return client;
};

export default useClient;
