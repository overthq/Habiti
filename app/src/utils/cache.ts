import { cacheExchange } from '@urql/exchange-graphcache';
import { CartsDocument, ProductDocument } from '../types/api';

// TODO: This file will handle the cacheExchange and all the
// necessary updates for the queries.
// Once done, link to actual useClient hook.

const customCache = cacheExchange({
	updates: {
		Mutation: {
			followStore(result, _args, cache) {
				const followedStores = cache.resolve('Query', 'followedStores');

				if (Array.isArray(followedStores)) {
					followedStores.push(result.followStore as any);
					cache.link('Query', 'followedStores', followedStores as any);
				}
			},
			addCart(result, _args, cache) {
				cache.updateQuery(
					{
						query: ProductDocument,
						variables: {
							id: result.productId
						}
					},
					data => {
						if (data?.product) {
							data.product.inCart = true;
							return data;
						}
					}
				);
				cache.readQuery({ query: CartsDocument });
			}
		}
	}
});

export default customCache;
