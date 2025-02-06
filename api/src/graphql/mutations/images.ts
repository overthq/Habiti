import cloudinary from 'cloudinary';

import { Resolver } from '../../types/resolvers';

export interface DeleteImageArgs {
	id: string;
}

export const deleteImage: Resolver<DeleteImageArgs> = async (
	_,
	{ id },
	ctx
) => {
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

export interface DeleteImagesArgs {
	imageIds: string[];
}

export const deleteImages: Resolver<DeleteImagesArgs> = async (
	_,
	{ imageIds },
	ctx
) => {
	const images = await ctx.prisma.image.findMany({
		where: { id: { in: imageIds } }
	});

	cloudinary.v2.api.delete_resources(
		images.map(({ publicId }) => publicId),
		error => {
			if (error) console.log(error);
			else console.log('Deleted');
		}
	);

	await ctx.prisma.image.deleteMany({ where: { id: { in: imageIds } } });

	return images;
};
