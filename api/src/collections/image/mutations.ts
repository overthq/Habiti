import { Resolver } from '../../types/resolvers';

interface DeleteImageArgs {
	id: string;
}

const deleteImage: Resolver<DeleteImageArgs> = async (_, { id }, ctx) => {
	await ctx.prisma.image.delete({
		where: { id }
	});
};

export default {
	Mutation: {
		deleteImage
	}
};
