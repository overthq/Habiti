import { ResolverContext } from '../../types/resolvers';

export const createStore = async (_, { input }, ctx: ResolverContext) => {
	// Get managerId from req.user (passed via ctx)
	const store = await ctx.prisma.store.create({
		data: {
			name: input.name,
			managers: {
				create: {
					managerId: ''
				}
			}
		}
	});

	return store;
};

export const followStore = () => {};

export const deleteStore = async (_, { id }, ctx: ResolverContext) => {
	await ctx.prisma.store.delete({ where: { id } });

	return id;
};

export default {
	Mutation: {
		createStore,
		followStore,
		deleteStore
	}
};
