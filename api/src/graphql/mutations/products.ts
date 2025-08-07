import { FileUpload } from 'graphql-upload';

import { Resolver } from '../../types/resolvers';
import { uploadImages } from '../../utils/upload';
import { canManageStore, storeAuthorizedResolver } from '../permissions';
import { Prisma } from '@prisma/client';

export interface CreateProductArgs {
	input: {
		name: string;
		description: string;
		unitPrice: number;
		quantity: number;
		imageFiles?: Promise<FileUpload>[];
	};
}

export const createProduct: Resolver<CreateProductArgs> = async (
	_,
	{ input },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('No storeId provided');
	}

	const permitted = await canManageStore(ctx.user.id, ctx.storeId);

	if (!permitted) {
		throw new Error('You do not have permission to manage this store');
	}

	const { imageFiles, ...rest } = input;

	let uploadedImages: { url: string; public_id: string }[] = [];

	if (imageFiles && imageFiles.length > 0) {
		uploadedImages = await uploadImages(imageFiles);
	}

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

export interface EditProductArgs {
	id: string;
	input: {
		name?: string;
		description?: string;
		unitPrice?: number;
		imageFiles?: Promise<FileUpload>[];
	};
}

export const editProduct: Resolver<EditProductArgs> = async (
	_,
	{ id, input },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('No storeId provided');
	}

	const permitted = await canManageStore(ctx.user.id, ctx.storeId);

	if (!permitted) {
		throw new Error('You do not have permission to manage this store');
	}

	const { imageFiles, ...rest } = input;

	let uploadedImages: { url: string; public_id: string }[] = [];

	if (imageFiles) {
		uploadedImages = await uploadImages(imageFiles);
	}

	let productUpdateInput: Prisma.ProductUpdateInput = { ...rest };

	if (uploadedImages.length > 0) {
		productUpdateInput.images = {
			createMany: {
				data: uploadedImages.map(({ url, public_id }) => ({
					path: url,
					publicId: public_id
				}))
			}
		};
	}

	const product = await ctx.prisma.product.update({
		where: { id, storeId: ctx.storeId },
		data: productUpdateInput
	});

	return product;
};

export interface DeleteProductArgs {
	id: string;
}

export const deleteProduct = storeAuthorizedResolver<DeleteProductArgs>(
	async (_, { id }, ctx) => {
		if (!ctx.storeId) {
			throw new Error('No storeId provided');
		}

		return ctx.prisma.product.delete({
			where: { id, storeId: ctx.storeId! }
		});
	}
);

export interface UpdateProductImagesArgs {
	id: string;
	input: {
		add: Promise<FileUpload>[];
		remove: string[];
	};
}

export const updateProductImages: Resolver<UpdateProductImagesArgs> = async (
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

export interface AddToWatchlistArgs {
	productId: string;
}

export const addToWatchlist: Resolver<AddToWatchlistArgs> = (
	_,
	{ productId },
	ctx
) => {
	return ctx.prisma.watchlistProduct.create({
		data: {
			productId,
			userId: ctx.user.id
		}
	});
};

export interface AddProductReviewArgs {
	input: {
		productId: string;
		body?: string;
		rating: number;
	};
}

export const addProductReview: Resolver<AddProductReviewArgs> = async (
	_,
	{ input },
	ctx
) => {
	const productReview = await ctx.prisma.productReview.create({
		data: {
			userId: ctx.user.id,
			productId: input.productId,
			body: input.body ?? null,
			rating: input.rating
		}
	});

	return productReview;
};

export interface AddProductOptionArgs {
	input: {
		productId: string;
		name: string;
		description?: string;
	};
}

export const addProductOption: Resolver<AddProductOptionArgs> = async (
	_,
	{ input },
	ctx
) => {
	const productOption = await ctx.prisma.productOption.create({
		data: {
			productId: input.productId,
			name: input.name,
			description: input.description ?? null
		}
	});

	return productOption;
};

export interface UpdateProductCategoriesArgs {
	id: string;
	input: {
		add: string[];
		remove: string[];
	};
}

export const updateProductCategories: Resolver<
	UpdateProductCategoriesArgs
> = async (_, { id, input }, ctx) => {
	await ctx.prisma.productCategory.deleteMany({
		where: { productId: id, categoryId: { in: input.remove } }
	});

	await ctx.prisma.productCategory.createMany({
		data: input.add.map(categoryId => ({ productId: id, categoryId })),
		skipDuplicates: true
	});

	const product = await ctx.prisma.product.findUnique({
		where: { id },
		include: { categories: true }
	});

	return product;
};

export interface CreateProductCategoryArgs {
	input: {
		name: string;
		description?: string;
	};
}

export const createProductCategory: Resolver<
	CreateProductCategoryArgs
> = async (_, { input }, ctx) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	const category = await ctx.prisma.storeProductCategory.create({
		data: {
			storeId: ctx.storeId,
			name: input.name,
			description: input.description ?? null
		}
	});

	return category;
};

export interface EditProductCategoryArgs {
	categoryId: string;
	input: {
		name?: string;
		description?: string;
	};
}

export const editProductCategory: Resolver<EditProductCategoryArgs> = async (
	_,
	{ categoryId, input },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	return ctx.prisma.storeProductCategory.update({
		where: { id: categoryId },
		data: input
	});
};

export interface DeleteProductCategoryArgs {
	categoryId: string;
}

export const deleteProductCategory: Resolver<
	DeleteProductCategoryArgs
> = async (_, { categoryId }, ctx) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	const category = await ctx.prisma.storeProductCategory.delete({
		where: { id: categoryId }
	});

	return category;
};
