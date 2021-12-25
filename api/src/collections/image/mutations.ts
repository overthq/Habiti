import { Resolver } from '../../types/resolvers';

interface DeleteImageArgs {
	id: string;
}

const deleteImage: Resolver<DeleteImageArgs> = async (_, { id }, ctx) => {
	const image = await ctx.prisma.image.delete({
		where: { id }
	});

	return image;
};

export default {
	Mutation: {
		deleteImage
	}
};
