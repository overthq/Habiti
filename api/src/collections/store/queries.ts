import { ResolverContext } from '../../types/resolvers';

const store = async (_, { id }, ctx: ResolverContext) => {
	const fetchedStore = await ctx.prisma.store.findUnique({ where: { id } });

	return fetchedStore;
};

const stores = async (_, __, ctx: ResolverContext) => {
	const fetchedStores = await ctx.prisma.store.findMany();

	return fetchedStores;
};

const followedStores = () => {};

export default {
	Query: {
		store,
		stores,
		followedStores
	}
};
