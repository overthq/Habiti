import { cacheExchange } from '@urql/exchange-graphcache';
import {
	MutationAddToCartArgs,
	MutationDeleteCartArgs,
	MutationFollowStoreArgs,
	MutationRemoveFromCartArgs,
	MutationUnfollowStoreArgs,
	MutationUpdateCartProductArgs
} from '../types/api';

// Because I'm a bit lazy, I have decided to just go ahead
// and invalidate entities instead of writing decent updaters.
// That said, anyone reading this should feel free to write
// good updaters that manipulate the cache.
//
// However, invalidating entities might actually be meta,
// because I can't tell the ways the schema is going to evolve
// in the near future, and we can implement schema-awareness
// to help us out till the schema is concrete.

// Important caveat: invalidating entities incurs the cost of
// a network request (I think). I should remember to add loading
// indicators or block the UI while this is happening.

const customCache = cacheExchange({
	updates: {
		Mutation: {
			followStore(_result, args: MutationFollowStoreArgs, cache) {
				cache.invalidate({
					__typename: 'Store',
					id: args.storeId
				});
			},
			unfollowStore(_result, args: MutationUnfollowStoreArgs, cache) {
				cache.invalidate({
					__typename: 'Store',
					id: args.storeId
				});
			},
			addToCart(_result, args: MutationAddToCartArgs, cache) {
				cache.invalidate({
					__typename: 'Product',
					id: args.input.productId
				});
				cache.invalidate({
					__typename: 'Cart',
					id: args.input.cartId
				});
			},
			removeFromCart(_result, args: MutationRemoveFromCartArgs, cache) {
				cache.invalidate({
					__typename: 'Product',
					id: args.productId
				});
				cache.invalidate({
					__typename: 'Cart',
					id: args.cartId
				});
			},
			deleteCart(_result, args: MutationDeleteCartArgs, cache) {
				// TODO: Invalidate the products as well.

				cache.invalidate({
					__typename: 'Cart',
					id: args.cartId
				});
			},
			updateCartProduct(_result, args: MutationUpdateCartProductArgs, cache) {
				cache.invalidate({
					__typename: 'Product',
					id: args.input.productId
				});
				cache.invalidate({
					__typename: 'Cart',
					id: args.input.cartId
				});
			}
		}
	}
});

export default customCache;
