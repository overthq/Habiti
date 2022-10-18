import { cacheExchange } from '@urql/exchange-graphcache';
import { CreateProductMutation } from '../types/api';

const customCache = cacheExchange({
	updates: {
		Mutation: {
			createProduct(result: CreateProductMutation, _args, cache) {
				cache.invalidate({
					__typename: 'Product',
					id: result.createProduct.id
				});
			}
		}
	}
});

export default customCache;
