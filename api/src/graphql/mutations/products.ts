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

interface AddToWatchlistArgs {
	productId: string;
}

const addToWatchlist: Resolver<AddToWatchlistArgs> = (
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

interface AddProductReviewArgs {
	input: {
		productId: string;
		body?: string;
		rating: number;
	};
}

const addProductReview: Resolver<AddProductReviewArgs> = async (
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

interface AddProductOptionArgs {
	input: {
		productId: string;
		name: string;
		description?: string;
	};
}

const addProductOption: Resolver<AddProductOptionArgs> = async (
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

interface UpdateProductCategoriesArgs {
	id: string;
	input: {
		add: string[];
		remove: string[];
	};
}

const updateProductCategories: Resolver<UpdateProductCategoriesArgs> = async (
	_,
	{ id, input },
	ctx
) => {
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

interface CreateProductCategoryArgs {
	input: {
		name: string;
		description?: string;
	};
}

const createProductCategory: Resolver<CreateProductCategoryArgs> = async (
	_,
	{ input },
	ctx
) => {
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

interface EditProductCategoryArgs {
	categoryId: string;
	input: {
		name?: string;
		description?: string;
	};
}

const editProductCategory: Resolver<EditProductCategoryArgs> = async (
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

interface DeleteProductCategoryArgs {
	categoryId: string;
}

const deleteProductCategory: Resolver<DeleteProductCategoryArgs> = async (
	_,
	{ categoryId },
	ctx
) => {
	if (!ctx.storeId) {
		throw new Error('Store not found');
	}

	const category = await ctx.prisma.storeProductCategory.delete({
		where: { id: categoryId }
	});

	return category;
};

export default {
	Mutation: {
		createProduct,
		editProduct,
		deleteProduct,
		addToWatchlist,
		updateProductImages,
		addProductReview,
		addProductOption,
		createProductCategory,
		editProductCategory,
		deleteProductCategory,
		updateProductCategories
	}
};
