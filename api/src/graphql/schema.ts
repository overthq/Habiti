import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload } from 'graphql-upload';

import Mutation from './mutations';
import { Query, fieldResolvers } from './queries';
import typeDefs from './types';

const resolvers = {
	Mutation,
	Query,
	Upload: GraphQLUpload,
	...fieldResolvers
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
