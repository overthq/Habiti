import { cacheExchange } from '@urql/exchange-graphcache';

const customCache = cacheExchange({
	updates: {
		Mutation: {}
	}
});

export default customCache;
