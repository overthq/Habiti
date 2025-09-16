import { createClient, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const generateClient = (accessToken?: string | null) => {
	return createClient({
		url: `${API_URL}/graphql`,
		exchanges: [customCache, fetchExchange],
		fetchOptions: {
			headers: {
				...(accessToken ? { authorization: `Bearer ${accessToken}` } : {})
			}
		}
	});
};

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
			followStore(_result, args: any, cache) {
				cache.invalidate({ __typename: 'Store', id: args.storeId });
			},
			unfollowStore(_result, args: any, cache) {
				cache.invalidate({ __typename: 'Store', id: args.storeId });
			},
			addToCart(_result, args: any, cache) {
				cache.invalidate({ __typename: 'Product', id: args.input.productId });
				cache.invalidate({ __typename: 'Store', id: args.input.storeId });
			},
			removeFromCart(_result, args: any, cache) {
				cache.invalidate({ __typename: 'Product', id: args.productId });
				cache.invalidate({ __typename: 'Cart', id: args.cartId });
			}
		}
	}
});
