import { cacheExchange } from '@urql/exchange-graphcache';
import { CreateProductMutation, UpdateOrderMutation } from '../types/api';

const customCache = cacheExchange({
	updates: {
		Mutation: {
			createProduct: (result: CreateProductMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Product',
					id: result.createProduct.id
				});
			},
			updateOrder: (result: UpdateOrderMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Order',
					id: result.updateOrder.id
				});
			}
		}
	}
});

export default customCache;
