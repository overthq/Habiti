import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload } from 'graphql-upload';
import merge from 'lodash/merge';

import userQueries from './graphql/queries/users';
import userMutations from './graphql/queries/users';
import UserTypes from './graphql/types/user';

import storeQueries from './graphql/queries/stores';
import storeMutations from './graphql/queries/stores';
import StoreTypes from './graphql/types/store';

import productQueries from './graphql/queries/products';
import productMutations from './graphql/mutations/products';
import ProductTypes from './graphql/types/product';

import orderQueries from './graphql/queries/orders';
import orderMutations from './graphql/mutations/orders';
import OrderTypes from './graphql/types/order';

import cartQueries from './graphql/queries/carts';
import cartMutations from './graphql/mutations/carts';
import CartTypes from './graphql/types/cart';

import imageMutations from './graphql/mutations/images';
import ImageTypes from './graphql/types/image';

import cardQueries from './graphql/queries/cards';
import cardMutations from './graphql/mutations/cards';
import CardTypes from './graphql/types/card';

import payoutMutations from './graphql/mutations/payouts';
import PayoutTypes from './graphql/types/payout';

import deliveryAddressMutations from './graphql/mutations/delivery-addresses';
import DeliveryAddressTypes from './graphql/types/delivery-address';

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
	cardQueries,
	cardMutations,
	payoutMutations,
	deliveryAddressMutations
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
		CardTypes,
		PayoutTypes,
		DeliveryAddressTypes
	],
	resolvers
});

export default schema;
