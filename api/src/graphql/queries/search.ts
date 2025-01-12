import { Resolver } from '../../types/resolvers';

interface SearchArgs {
	searchTerm: string;
}

const search: Resolver<SearchArgs> = async (_, { searchTerm }, ctx) => {
	const [stores, products] = await ctx.prisma.$transaction([
		ctx.prisma.store.findMany({
			where: { name: { search: searchTerm } }
		}),
		ctx.prisma.product.findMany({
			where: { name: { search: searchTerm } }
		})
	]);

	return { stores, products };
};

export default {
	Query: { search }
};
