import { createClient, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import env from '../../env';

export const create = (accessToken: string | null) =>
	createClient({
		url: `${env.apiUrl}/graphql`,
		fetchOptions: {
			headers: { authorization: `Bearer ${accessToken}` }
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					store_followers: data => data.store_id as string,
					store_avatar_images: data => data.store_id as string,
					item_images: data => `${data.item_id}-${data.image_id}`,
					order_items: data => `${data.order_id}-${data.item_id}`
				}
			}),
			fetchExchange
		]
	});
