import { cacheExchange } from '@urql/exchange-graphcache';

import {
	MutationAddToCartArgs,
	MutationDeleteCartArgs,
	MutationFollowStoreArgs,
	MutationRemoveFromCartArgs,
	MutationUnfollowStoreArgs,
	MutationUpdateCartProductArgs,
	MutationAddToWatchlistArgs,
	MutationCreateOrderArgs
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
			createOrder(_result, args: MutationCreateOrderArgs, cache) {
				// cache.invalidate({ __typename: 'Cart' });
				// cache.invalidate({ __typename: 'User' });
				// cache.invalidate({ __typename: 'Store' });
			}
		}
	}
});

export default customCache;
