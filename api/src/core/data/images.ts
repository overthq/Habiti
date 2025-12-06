import { PrismaClient } from '../../generated/prisma/client';

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
	prisma: PrismaClient,
	params: CreateImageParams
) => {
	const image = await prisma.image.create({
		data: params
	});

	return image;
};

export const updateImage = async (
	prisma: PrismaClient,
	imageId: string,
	params: UpdateImageParams
) => {
	const image = await prisma.image.update({
		where: { id: imageId },
		data: params
	});

	return image;
};

export const getImageById = async (prisma: PrismaClient, imageId: string) => {
	const image = await prisma.image.findUnique({
		where: { id: imageId }
	});

	return image;
};

export const getImagesByProductId = async (
	prisma: PrismaClient,
	productId: string
) => {
	const images = await prisma.image.findMany({
		where: { productId },
		orderBy: { createdAt: 'asc' }
	});

	return images;
};

export const getImageByStoreId = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const image = await prisma.image.findFirst({
		where: { storeId }
	});

	return image;
};

export const deleteImage = async (prisma: PrismaClient, imageId: string) => {
	await prisma.image.delete({
		where: { id: imageId }
	});
};

export const deleteImagesByProductId = async (
	prisma: PrismaClient,
	productId: string
) => {
	await prisma.image.deleteMany({
		where: { productId }
	});
};
