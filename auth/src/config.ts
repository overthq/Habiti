import redis from 'redis';
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(process.env.API_URL, {
	headers: { 'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET }
});
export const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', error => {
	throw new Error(error);
});
