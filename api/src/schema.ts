/* eslint-disable */
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload } from 'graphql-upload';
import merge from 'lodash/merge';

import userQueries from './collections/user/queries';
import userMutations from './collections/user/mutations';
import UserTypes from './collections/user/types';

import storeQueries from './collections/store/queries';
import storeMutations from './collections/store/mutations';
import StoreTypes from './collections/store/types';

import productQueries from './collections/product/queries';
import productMutations from './collections/product/mutations';
import ProductTypes from './collections/product/types';

import orderQueries from './collections/order/queries';
import orderMutations from './collections/order/mutations';
import OrderTypes from './collections/order/types';

import cartQueries from './collections/cart/queries';
import cartMutations from './collections/cart/mutations';
import CartTypes from './collections/cart/types';

import imageMutations from './collections/image/mutations';
import ImageTypes from './collections/image/types';

import storeFollowerQueries from './collections/store-follower/queries';
import storeFollowerMutations from './collections/store-follower/mutations';
import StoreFollowerTypes from './collections/store-follower/types';

import storeManagerQueries from './collections/store-manager/queries';
import storeManagerMutations from './collections/store-manager/mutations';
import StoreManagerTypes from './collections/store-manager/types';

import cartProductQueries from './collections/cart-product/queries';
import cartProductMutations from './collections/cart-product/mutations';
import CartProductTypes from './collections/cart-product/types';

import cardQueries from './collections/card/queries';
import cardMutations from './collections/card/mutations';
import CardTypes from './collections/card/types';

import orderProductQueries from './collections/order-product/queries';
import OrderProductTypes from './collections/order-product/types';

import watchlistProductQueries from './collections/watchlist-product/queries';
import watchlistProductMutations from './collections/watchlist-product/mutations';
import WatchlistProductTypes from './collections/watchlist-product/types';

import statsQueries from './collections/stats/queries';
import StatsTypes from './collections/stats/types';

import payoutMutations from './collections/payout/mutations';
import PayoutTypes from './collections/payout/types';

import productCategoryQueries from './collections/product-category/queries';
import productCategoryMutations from './collections/product-category/mutations';
import ProductCategoryTypes from './collections/product-category/types';

import deliveryAddressMutations from './collections/delivery-address/mutations';
import DeliveryAddressTypes from './collections/delivery-address/types';

import ProductReviewTypes from './collections/product-review/types';
import productReviewQueries from './collections/product-review/queries';
import productReviewMutations from './collections/product-review/mutations';

import ProductOptionTypes from './collections/product-option/types';
import productOptionMutations from './collections/product-option/mutations';

import PushTokenTypes from './collections/push-token/types';
import pushTokenQueries from './collections/push-token/queries';

const Root = `
	scalar Upload

	interface Node {
		id: ID!
	}

	type PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
	}

	enum Sort {
		asc
		desc
	}

	input IntWhere {
		lt: Int
		lte: Int
		gt: Int
		gte: Int
	}

	enum StringWhereMode {
		default
		insensitive
	}

	input StringWhere {
		contains: String
		search: String
		startsWith: String
		endsWith: String
		mode: StringWhereMode
		equals: String
	}

	type Query {
		node(id: ID!): Node
	}

	type Mutation { _: Boolean }
`;

const resolvers = merge(
	{ Upload: GraphQLUpload },
	userQueries,
	userMutations,
	orderQueries,
	orderMutations,
	productQueries,
	productMutations,
	storeQueries,
	storeMutations,
	cartQueries,
	cartMutations,
	imageMutations,
	storeFollowerQueries,
	storeFollowerMutations,
	storeManagerQueries,
	storeManagerMutations,
	cartProductQueries,
	cartProductMutations,
	cardQueries,
	cardMutations,
	orderProductQueries,
	watchlistProductQueries,
	watchlistProductMutations,
	statsQueries,
	payoutMutations,
	productCategoryQueries,
	productCategoryMutations,
	deliveryAddressMutations,
	productReviewQueries,
	productReviewMutations,
	productOptionMutations,
	pushTokenQueries
);

const schema = makeExecutableSchema({
	typeDefs: [
		Root,
		UserTypes,
		StoreTypes,
		ProductTypes,
		OrderTypes,
		CartTypes,
		ImageTypes,
		StoreFollowerTypes,
		StoreManagerTypes,
		CartProductTypes,
		CardTypes,
		OrderProductTypes,
		WatchlistProductTypes,
		StatsTypes,
		PayoutTypes,
		ProductCategoryTypes,
		DeliveryAddressTypes,
		ProductReviewTypes,
		ProductOptionTypes,
		PushTokenTypes
	],
	resolvers
});

export default schema;
