import { cacheExchange } from '@urql/exchange-graphcache';

import {
	AddStoreManagerMutation,
	CreateProductCategoryMutation,
	CreateProductMutation,
	DeleteProductCategoryMutation,
	EditProductCategoryMutation,
	EditProductMutation,
	EditStoreMutation,
	UpdateOrderMutation,
	CreatePayoutMutation
} from '../types/api';

const customCache = cacheExchange({
	updates: {
		Mutation: {
			createProduct: (result: CreateProductMutation, _args, cache) => {
				cache.invalidate({ __typename: 'Product' });
				cache.invalidate({ __typename: 'Store' });
			},
			editProduct: (result: EditProductMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Product',
					id: result.editProduct.id
				});
			},
			updateOrder: (result: UpdateOrderMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Order',
					id: result.updateOrder.id
				});
				cache.invalidate({ __typename: 'Store' });
			},
			addStoreManager: (result: AddStoreManagerMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'StoreManager',
					id: result.addStoreManager.id
				});
				cache.invalidate({ __typename: 'Store' });
			},
			createProductCategory: (
				_result: CreateProductCategoryMutation,
				_args,
				cache
			) => {
				cache.invalidate({ __typename: 'StoreProductCategory' });
				cache.invalidate({ __typename: 'Store' });
			},
			editProductCategory: (
				result: EditProductCategoryMutation,
				_args,
				cache
			) => {
				cache.invalidate({
					__typename: 'StoreProductCategory',
					id: result.editProductCategory.id
				});
			},
			deleteProductCategory: (
				result: DeleteProductCategoryMutation,
				_args,
				cache
			) => {
				cache.invalidate({
					__typename: 'StoreProductCategory',
					id: result.deleteProductCategory.id
				});
				cache.invalidate({ __typename: 'Store' });
			},
			editStore: (result: EditStoreMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Store',
					id: result.editStore.id
				});
			},
			createPayout: (_result: CreatePayoutMutation, _args, cache) => {
				cache.invalidate({ __typename: 'Store' });
			}
		}
	}
});

export default customCache;
