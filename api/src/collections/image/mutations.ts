import cloudinary from 'cloudinary';

import { Resolver } from '../../types/resolvers';

interface DeleteImageArgs {
	id: string;
}

const deleteImage: Resolver<DeleteImageArgs> = async (_, { id }, ctx) => {
	const image = await ctx.prisma.image.delete({ where: { id } });

	cloudinary.v2.uploader.destroy(
		image.publicId,
		{ invalidate: true },
		error => {
			if (error) console.log(error);
			else console.log('Deleted');
		}
	);

	return image;
};

export default {
	Mutation: {
		deleteImage
	}
};
