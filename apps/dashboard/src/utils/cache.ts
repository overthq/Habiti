import { cacheExchange } from '@urql/exchange-graphcache';

import {
	AddStoreManagerMutation,
	CreateProductCategoryMutation,
	CreateProductMutation,
	UpdateOrderMutation
} from '../types/api';

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
			},
			addStoreManager: (result: AddStoreManagerMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'StoreManager',
					id: result.addStoreManager.id
				});
			},
			createProductCategory: (
				result: CreateProductCategoryMutation,
				_args,
				cache
			) => {
				cache.invalidate({
					__typename: 'StoreProductCategory',
					id: result.createProductCategory.id
				});
			}
		}
	}
});

export default customCache;
