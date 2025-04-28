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
	keys: {
		OrderProduct: data => `${data.orderId}-${data.productId}`,
		CartProduct: data => `${data.cartId}-${data.productId}`,
		ProductCategory: data => `${data.categoryId}-${data.productId}`,
		StoreManager: data => `${data.storeId}-${data.managerId}`
	},
	updates: {
		Mutation: {
			createProduct: (result: CreateProductMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Product',
					id: result.createProduct.id
				});
				cache.invalidate({
					__typename: 'Store',
					id: result.createProduct.storeId
				});
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
				cache.invalidate('StoreManager');
			},
			createProductCategory: (
				_result: CreateProductCategoryMutation,
				_args,
				cache
			) => {
				cache.invalidate('StoreProductCategory');
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
				_result: DeleteProductCategoryMutation,
				_args,
				cache
			) => {
				cache.invalidate('StoreProductCategory');
			},
			editStore: (result: EditStoreMutation, _args, cache) => {
				cache.invalidate({
					__typename: 'Store',
					id: result.editStore.id
				});
			},
			createPayout: (_result: CreatePayoutMutation, _args, cache) => {
				cache.invalidate('Payout');
			}
		}
	}
});

export default customCache;
