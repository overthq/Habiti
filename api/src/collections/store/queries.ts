import { Resolver } from '../../types/resolvers';

interface StoreArgs {
	id: string;
}

const store: Resolver<StoreArgs> = async (_, { id }, ctx) => {
	const fetchedStore = await ctx.prisma.store.findUnique({ where: { id } });

	return fetchedStore;
};

const stores: Resolver = async (_, __, ctx) => {
	const fetchedStores = await ctx.prisma.store.findMany();

	return fetchedStores;
};

const followedStores: Resolver = async (_, __, ctx) => {
	const { followed } = await ctx.prisma.user.findUnique({
		where: { id: ctx.user.id },
		include: {
			followed: true
		}
	});

	return followed;
};

export default {
	Query: {
		store,
		stores,
		followedStores
	}
};
