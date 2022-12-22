import { createClient, dedupExchange, Client } from 'urql';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';

import env from '../../env';
import customCache from '../utils/cache';
import useStore from '../state';

export let client: Client;

export const setClient = () => {
	const { accessToken, activeStore } = useStore();

	client = createClient({
		url: `${env.apiUrl}/graphql`,
		fetchOptions: {
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : '',
				'x-market-store-id': activeStore ?? ''
			}
		},
		exchanges: [dedupExchange, customCache, multipartFetchExchange]
	});
};
