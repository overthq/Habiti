import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLUpload } from 'graphql-upload';

import Mutation from './mutations';
import Query from './queries';
import typeDefs from './types';

const resolvers = {
	Mutation,
	Query,
	Upload: GraphQLUpload
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
