import { createClient, cacheExchange, fetchExchange } from 'urql';

const client = createClient({
	url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
	exchanges: [cacheExchange, fetchExchange]
});

export default client;
