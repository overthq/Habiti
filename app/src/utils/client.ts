import { createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import env from '../../env';

export const create = (accessToken: string | null) =>
	createClient({
		url: env.hasuraUrl,
		fetchOptions: {
			headers: { authorization: `Bearer ${accessToken}` }
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					store_followers: data => data.store_id as string
				}
			}),
			fetchExchange
		]
	});
