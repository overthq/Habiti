import { Resolver } from '../../types/resolvers';

export interface SearchArgs {
	searchTerm: string;
}

const search: Resolver<SearchArgs> = async (_, { searchTerm }, ctx) => {
	const [stores, products] = await ctx.prisma.$transaction([
		ctx.prisma.store.findMany({
			where: {
				name: { search: searchTerm },
				...(!ctx.isAdmin ? {} : { unlisted: false })
			}
		}),
		ctx.prisma.product.findMany({
			where: {
				name: { search: searchTerm },
				...(!ctx.isAdmin ? {} : { store: { unlisted: false } })
			}
		})
	]);

	return { stores, products };
};

export default {
	Query: { search }
};
