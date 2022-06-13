import { cacheExchange } from '@urql/exchange-graphcache';

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
			addProductToCart() {
				// Do something
			}
		}
	}
});

export default customCache;
