import { cacheExchange } from '@urql/exchange-graphcache';

import {
	MutationAddToCartArgs,
	MutationDeleteCartArgs,
	MutationFollowStoreArgs,
	MutationRemoveFromCartArgs,
	MutationUnfollowStoreArgs,
	MutationUpdateCartProductArgs,
	MutationAddToWatchlistArgs,
	MutationCreateOrderArgs,
	CreateOrderMutation,
	AddToCartMutation
} from '../types/api';

const customCache = cacheExchange({
	keys: {
		OrderProduct: data => `${data.orderId}-${data.productId}`,
		CartProduct: data => `${data.cartId}-${data.productId}`,
		ProductCategory: data => `${data.categoryId}-${data.productId}`,
		StoreManager: data => `${data.storeId}-${data.managerId}`,
		StoreFollower: data => `${data.storeId}-${data.followerId}`,
		WatchlistProduct: data => `${data.productId}-${data.userId}`
	},
	updates: {
		Mutation: {
			followStore(_result, args: MutationFollowStoreArgs, cache) {
				cache.invalidate({ __typename: 'Store', id: args.storeId });
			},
			unfollowStore(_result, args: MutationUnfollowStoreArgs, cache) {
				cache.invalidate({ __typename: 'Store', id: args.storeId });
			},
			addToCart(result: AddToCartMutation, args: MutationAddToCartArgs, cache) {
				cache.invalidate({ __typename: 'Cart', id: result.addToCart.cartId });
				cache.invalidate({ __typename: 'Product', id: args.input.productId });
				cache.invalidate({ __typename: 'Store', id: args.input.storeId });
			},
			removeFromCart(_result, args: MutationRemoveFromCartArgs, cache) {
				cache.invalidate({ __typename: 'Product', id: args.productId });
				cache.invalidate({ __typename: 'Cart', id: args.cartId });
			},
			deleteCart(_result, args: MutationDeleteCartArgs, cache) {
				cache.invalidate({ __typename: 'Cart', id: args.cartId });
				cache.invalidate('Cart');
			},
			updateCartProduct(_result, args: MutationUpdateCartProductArgs, cache) {
				cache.invalidate({ __typename: 'Product', id: args.input.productId });
				cache.invalidate({ __typename: 'Cart', id: args.input.cartId });
			},
			addToWatchlist(_result, args: MutationAddToWatchlistArgs, cache) {
				cache.invalidate({ __typename: 'Product', id: args.productId });
			},
			createOrder(
				_result: CreateOrderMutation,
				args: MutationCreateOrderArgs,
				cache
			) {
				// cache.invalidate({
				// 	__typename: 'Cart',
				// 	id: args.input.cartId
				// });
				// cache.invalidate({
				// 	__typename: 'Store',
				// 	id: _result.createOrder.store.id
				// });
			}
		}
	}
});

export default customCache;
