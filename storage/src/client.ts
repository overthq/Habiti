import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:8080/v1/graphql', {
	headers: {
		'x-hasura-admin-secret': 'market-admin-secret'
	}
});

export default client;
