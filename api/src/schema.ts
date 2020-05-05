import { makeExecutableSchema } from 'graphql-tools';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';

import UserType from './types/User';
import ItemType from './types/Item';
import OrderType from './types/Order';
import StoreType from './types/Store';

import * as userMutations from './mutations/users';
import * as itemMutations from './mutations/items';
import * as orderMutations from './mutations/orders';
import * as storeMutations from './mutations/stores';

import * as userQueries from './queries/users';
import * as itemQueries from './queries/items';
import * as orderQueries from './queries/orders';
import * as storeQueries from './queries/stores';

const RootType = `
	type Mutation { default: String }
	type Query { default: String }
`;

const typeDefs = [
	DIRECTIVES,
	RootType,
	UserType,
	ItemType,
	OrderType,
	StoreType
];

const resolvers = {
	Mutation: {
		...userMutations,
		...itemMutations,
		...orderMutations,
		...storeMutations
	},
	Query: {
		...userQueries,
		...itemQueries,
		...orderQueries,
		...storeQueries
	}
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
