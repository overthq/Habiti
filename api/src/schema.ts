import { makeExecutableSchema } from '@graphql-tools/schema';
import merge from 'lodash/merge';

import * as userQueries from './collections/user/queries';
import * as userMutations from './collections/user/mutations';
import UserTypes from './collections/user/types';

import * as storeQueries from './collections/store/queries';
import * as storeMutations from './collections/store/mutations';
import StoreTypes from './collections/store/types';

import * as productQueries from './collections/product/queries';
import * as productMutations from './collections/product/mutations';
import ProductTypes from './collections/product/types';

import * as orderQueries from './collections/order/queries';
import * as orderMutations from './collections/order/mutations';
import OrderTypes from './collections/order/types';

const Root = `
	type Query { _: Boolean }
	type Mutation { _: Boolean }
`;

const resolvers = merge(
	{},
	userQueries,
	userMutations,
	orderQueries,
	orderMutations,
	productQueries,
	productMutations,
	storeQueries,
	storeMutations
);

const schema = makeExecutableSchema({
	typeDefs: [Root, UserTypes, StoreTypes, ProductTypes, OrderTypes],
	resolvers
});

export default schema;
