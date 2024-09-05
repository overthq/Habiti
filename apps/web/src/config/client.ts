import { createClient, cacheExchange, fetchExchange } from 'urql';

export const generateClient = (accessToken?: string) => {
	return createClient({
		url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
		exchanges: [cacheExchange, fetchExchange],
		fetchOptions: {
			headers: {
				...(accessToken ? { authorization: `Bearer ${accessToken}` } : {})
			}
		}
	});
};
