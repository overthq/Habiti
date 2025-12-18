import { FileUpload } from 'graphql-upload';

import * as ProductLogic from '../../core/logic/products';
import { Resolver } from '../../types/resolvers';
import { uploadImages } from '../../utils/upload';
import { storeAuthorizedResolver } from '../permissions';

export interface CreateProductArgs {
	input: {
		name: string;
		description: string;
		unitPrice: number;
		quantity: number;
		imageFiles?: Promise<FileUpload>[];
	};
}

export const createProduct = storeAuthorizedResolver<CreateProductArgs>(
	async (_, { input }, ctx) => {
		if (!ctx.storeId) {
			throw new Error('No storeId provided');
		}

		const { imageFiles, ...rest } = input;

		let createProductInput: ProductLogic.CreateProductInput = {
			...rest,
			storeId: ctx.storeId
		};

		if (imageFiles && imageFiles.length > 0) {
			const uploadedImages = await uploadImages(imageFiles);

			createProductInput.images = uploadedImages.map(({ url, public_id }) => ({
				path: url,
				publicId: public_id
			}));
		}

		return ProductLogic.createProduct(ctx, createProductInput);
	}
);

export interface EditProductArgs {
	id: string;
	input: {
		name?: string;
		description?: string;
		unitPrice?: number;
		imageFiles?: Promise<FileUpload>[];
	};
}

export const editProduct = storeAuthorizedResolver<EditProductArgs>(
	async (_, { id, input }, ctx) => {
		if (!ctx.storeId) {
			throw new Error('No storeId provided');
		}

		const { imageFiles, ...rest } = input;

		let productUpdateInput: ProductLogic.UpdateProductInput = {
			...rest,
			productId: id
		};

		if (imageFiles && imageFiles.length > 0) {
			const uploadedImages = await uploadImages(imageFiles);

			productUpdateInput.images = uploadedImages.map(({ url, public_id }) => ({
				path: url,
				publicId: public_id
			}));
		}

		return ProductLogic.updateProduct(ctx, productUpdateInput);
	}
);

export interface DeleteProductArgs {
	id: string;
}

export const deleteProduct = storeAuthorizedResolver<DeleteProductArgs>(
	async (_, { id }, ctx) => {
		return ProductLogic.deleteProduct(ctx, { productId: id });
	}
);

export interface AddToWatchlistArgs {
	productId: string;
}

export const addToWatchlist: Resolver<AddToWatchlistArgs> = (
	_,
	{ productId },
	ctx
) => {
	return ProductLogic.addToWatchlist(ctx, { productId });
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
	return ProductLogic.createProductReview(ctx, {
		productId: input.productId,
		rating: input.rating,
		body: input.body
	});
};

export interface AddProductOptionArgs {
	input: {
		productId: string;
		name: string;
		description?: string;
	};
}

export const addProductOption = storeAuthorizedResolver<AddProductOptionArgs>(
	(_, { input }, ctx) => {
		return ProductLogic.createProductOption(ctx, {
			productId: input.productId,
			name: input.name,
			description: input.description
		});
	}
);

export interface UpdateProductCategoriesArgs {
	id: string;
	input: {
		add: string[];
		remove: string[];
	};
}

export const updateProductCategories =
	storeAuthorizedResolver<UpdateProductCategoriesArgs>(
		(_, { id, input }, ctx) => {
			return ProductLogic.updateProductCategories(ctx, {
				productId: id,
				addCategoryIds: input.add,
				removeCategoryIds: input.remove
			});
		}
	);

export interface CreateProductCategoryArgs {
	input: {
		name: string;
		description?: string;
	};
}

export const createProductCategory =
	storeAuthorizedResolver<CreateProductCategoryArgs>((_, { input }, ctx) => {
		return ProductLogic.createStoreProductCategory(ctx, {
			name: input.name,
			description: input.description
		});
	});

export interface EditProductCategoryArgs {
	categoryId: string;
	input: {
		name?: string;
		description?: string;
	};
}

export const editProductCategory =
	storeAuthorizedResolver<EditProductCategoryArgs>(
		(_, { categoryId, input }, ctx) => {
			return ProductLogic.updateStoreProductCategory(ctx, {
				categoryId,
				...input
			});
		}
	);

export interface DeleteProductCategoryArgs {
	categoryId: string;
}

export const deleteProductCategory =
	storeAuthorizedResolver<DeleteProductCategoryArgs>(
		(_, { categoryId }, ctx) => {
			return ProductLogic.deleteStoreProductCategory(ctx, {
				categoryId
			});
		}
	);
