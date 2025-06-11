import { ResolverContext } from '../../types/resolvers';

interface CreateImageParams {
	publicId: string;
	path: string;
	productId: string;
	storeId: string | null;
}

interface UpdateImageParams {
	publicId?: string;
	path?: string;
}

export const createImage = async (
	ctx: ResolverContext,
	params: CreateImageParams
) => {
	const image = await ctx.prisma.image.create({
		data: params
	});

	return image;
};

export const updateImage = async (
	ctx: ResolverContext,
	imageId: string,
	params: UpdateImageParams
) => {
	const image = await ctx.prisma.image.update({
		where: { id: imageId },
		data: params
	});

	return image;
};

export const getImageById = async (ctx: ResolverContext, imageId: string) => {
	const image = await ctx.prisma.image.findUnique({
		where: { id: imageId }
	});

	return image;
};

export const getImagesByProductId = async (
	ctx: ResolverContext,
	productId: string
) => {
	const images = await ctx.prisma.image.findMany({
		where: { productId },
		orderBy: { createdAt: 'asc' }
	});

	return images;
};

export const getImageByStoreId = async (
	ctx: ResolverContext,
	storeId: string
) => {
	const image = await ctx.prisma.image.findFirst({
		where: { storeId }
	});

	return image;
};

export const deleteImage = async (ctx: ResolverContext, imageId: string) => {
	await ctx.prisma.image.delete({
		where: { id: imageId }
	});
};

export const deleteImagesByProductId = async (
	ctx: ResolverContext,
	productId: string
) => {
	await ctx.prisma.image.deleteMany({
		where: { productId }
	});
};
