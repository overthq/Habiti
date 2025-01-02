import { cacheExchange } from '@urql/exchange-graphcache';

import {
	MutationAddToCartArgs,
	MutationCreateProductCategoryArgs,
	MutationDeleteCartArgs,
	MutationDeleteProductCategoryArgs,
	MutationEditProductCategoryArgs,
	MutationFollowStoreArgs,
	MutationRemoveFromCartArgs,
	MutationUnfollowStoreArgs,
	MutationUpdateCartProductArgs
} from '../types/api';

const customCache = cacheExchange({
	updates: {
		Mutation: {
			followStore(_result, args: MutationFollowStoreArgs, cache) {
				cache.invalidate({ __typename: 'Store', id: args.storeId });
			},
			unfollowStore(_result, args: MutationUnfollowStoreArgs, cache) {
				cache.invalidate({ __typename: 'Store', id: args.storeId });
			},
			addToCart(_result, args: MutationAddToCartArgs, cache) {
				cache.invalidate({ __typename: 'Product', id: args.input.productId });
				cache.invalidate({ __typename: 'Store', id: args.input.storeId });
			},
			removeFromCart(_result, args: MutationRemoveFromCartArgs, cache) {
				cache.invalidate({ __typename: 'Product', id: args.productId });
				cache.invalidate({ __typename: 'Cart', id: args.cartId });
			},
			deleteCart(_result, args: MutationDeleteCartArgs, cache) {
				// TODO: Invalidate the products as well.
				cache.invalidate({ __typename: 'Cart', id: args.cartId });
			},
			updateCartProduct(_result, args: MutationUpdateCartProductArgs, cache) {
				cache.invalidate({ __typename: 'Product', id: args.input.productId });
				cache.invalidate({ __typename: 'Cart', id: args.input.cartId });
			},
			createProductCategory(
				_result,
				_args: MutationCreateProductCategoryArgs,
				cache
			) {
				console.log('createProductCategory', _result, _args);
				cache.invalidate({ __typename: 'StoreProductCategory' });
			},
			editProductCategory(
				_result,
				args: MutationEditProductCategoryArgs,
				cache
			) {
				cache.invalidate({
					__typename: 'StoreProductCategory',
					id: args.categoryId
				});
			},
			deleteProductCategory(
				_result,
				args: MutationDeleteProductCategoryArgs,
				cache
			) {
				cache.invalidate({
					__typename: 'StoreProductCategory',
					id: args.categoryId
				});
			}
		}
	}
});

export default customCache;
