import { FileUpload } from 'graphql-upload';

import { Resolver } from '../../types/resolvers';
import { uploadImages } from '../../utils/upload';

interface CreateProductArgs {
	input: {
		name: string;
		description: string;
		unitPrice: number;
		quantity: number;
		imageFiles: Promise<FileUpload>[];
	};
}

const createProduct: Resolver<CreateProductArgs> = async (
	_,
	{ input },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('No storeId provided');
	}

	const { imageFiles, ...rest } = input;

	const uploadedImages = await uploadImages(imageFiles);

	const product = await ctx.prisma.product.create({
		data: {
			...rest,
			storeId: ctx.storeId,
			images: {
				createMany: {
					data: uploadedImages.map(({ url, public_id }) => ({
						path: url,
						publicId: public_id
					}))
				}
			}
		}
	});

	return product;
};

interface EditProductArgs {
	id: string;
	input: {
		name?: string;
		description?: string;
		unitPrice?: number;
		imageFiles: Promise<FileUpload>[];
	};
}

const editProduct: Resolver<EditProductArgs> = async (
	_,
	{ id, input },
	ctx
) => {
	const { imageFiles, ...rest } = input;

	const uploadedImages = await uploadImages(imageFiles);

	const product = await ctx.prisma.product.update({
		where: { id },
		data: {
			...rest,
			images: {
				createMany: {
					data: uploadedImages.map(({ url, public_id }) => ({
						path: url,
						publicId: public_id
					}))
				}
			}
		}
	});

	return product;
};

interface DeleteProductArgs {
	id: string;
}

const deleteProduct: Resolver<DeleteProductArgs> = async (_, { id }, ctx) => {
	const product = await ctx.prisma.product.delete({ where: { id } });

	return product;
};

interface UpdateProductImagesArgs {
	id: string;
	input: {
		add: Promise<FileUpload>[];
		remove: string[];
	};
}

const updateProductImages: Resolver<UpdateProductImagesArgs> = async (
	_,
	{ id, input },
	ctx
) => {
	const uploadedImages = await uploadImages(input.add);

	if (input.remove.length > 0) {
		await ctx.prisma.image.deleteMany({
			where: { id: { in: input.remove } }
		});
	}

	const product = await ctx.prisma.product.update({
		where: { id },
		data: {
			images: {
				createMany: {
					data: uploadedImages.map(({ url, public_id }) => ({
						path: url,
						publicId: public_id
					}))
				}
			}
		}
	});

	return product;
};

export default {
	Mutation: {
		createProduct,
		editProduct,
		deleteProduct,
		updateProductImages
	}
};
