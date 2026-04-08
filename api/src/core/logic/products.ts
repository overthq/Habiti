import type { Context } from 'hono';

import { ProductStatus } from '../../generated/prisma/client';
import type { StripUndefined } from '../../utils/objects';
import * as ProductData from '../data/products';

import type { AppEnv } from '../../types/hono';
import { ProductFilters } from '../../utils/queries';
import { LogicError, LogicErrorCode } from './errors';

export interface CreateProductInput {
	name: string;
	description: string;
	unitPrice: number;
	quantity?: number;
	storeId: string;
	categoryId?: string;
	status?: ProductStatus;
	images?: {
		path: string;
		publicId: string;
	}[];
}

export const createProduct = async (
	c: Context<AppEnv>,
	input: CreateProductInput
) => {
	const { storeId, ...productData } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (c.var.storeId && c.var.storeId !== storeId && !c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const product = await ProductData.createProduct(c.var.prisma, {
		...productData,
		storeId
	});

	c.var.services.analytics.track({
		event: 'product_created',
		distinctId: c.var.auth.id,
		properties: {
			productId: product.id,
			productName: product.name,
			unitPrice: product.unitPrice,
			quantity: product.quantity,
			status: product.status
		},
		groups: { store: storeId }
	});

	return product;
};

export interface UpdateProductInput {
	productId: string;
	name?: string | undefined;
	description?: string | undefined;
	unitPrice?: number | undefined;
	quantity?: number | undefined;
	categoryId?: string | undefined;
	status?: ProductStatus | undefined;
	images?: { path: string; publicId: string }[] | undefined;
}

export const updateProduct = async (
	c: Context<AppEnv>,
	input: UpdateProductInput
) => {
	const { productId, ...updateData } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const existingProduct = await ProductData.getProductById(
		c.var.prisma,
		productId
	);

	if (!existingProduct) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	// TODO: To simplify store manager actions, it might make sense
	// to not have the /stores/current concept, and just pass in the
	// store we are referring to explicitly every time.

	if (
		!c.var.isAdmin &&
		c.var.storeId &&
		c.var.storeId !== existingProduct.storeId
	) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const product = await ProductData.updateProduct(
		c.var.prisma,
		productId,
		updateData as StripUndefined<typeof updateData>
	);

	c.var.services.analytics.track({
		event: 'product_updated',
		distinctId: c.var.auth.id,
		properties: {
			productId: product.id,
			productName: product.name,
			updatedFields: Object.keys(updateData)
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const getProductById = async (c: Context<AppEnv>, productId: string) => {
	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (product.status === ProductStatus.Archived && !c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	const productViewerContext = c.var.auth?.id
		? await ProductData.getProductViewerContext(
				c.var.prisma,
				c.var.auth.id,
				product.id
			)
		: null;

	if (c.var.auth?.id) {
		c.var.services.analytics.track({
			event: 'product_viewed',
			distinctId: c.var.auth?.id,
			properties: {
				productId: product.id,
				productName: product.name,
				unitPrice: product.unitPrice
			},
			groups: { store: product.storeId }
		});
	}

	return { product, viewerContext: productViewerContext };
};

export const getProductReviews = async (
	c: Context<AppEnv>,
	productId: string
) => {
	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	return ProductData.getProductReviews(c.var.prisma, productId);
};

export const getProductsByStoreId = async (
	c: Context<AppEnv>,
	storeId: string
) => {
	return ProductData.getProductsByStoreId(c.var.prisma, storeId);
};

interface ArchiveProductInput {
	productId: string;
}

export const archiveProduct = async (
	c: Context<AppEnv>,
	input: ArchiveProductInput
) => {
	const { productId } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (c.var.storeId && c.var.storeId !== product.storeId && !c.var.isAdmin) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	await ProductData.archiveProduct(c.var.prisma, productId);

	c.var.services.analytics.track({
		event: 'product_archived',
		distinctId: c.var.auth.id,
		properties: {
			productId: product.id,
			productName: product.name,
			unitPrice: product.unitPrice,
			quantity: product.quantity
		},
		groups: { store: product.storeId }
	});

	return product;
};

interface CreateProductReviewInput {
	productId: string;
	rating: number;
	body: string | undefined;
}

export const createProductReview = async (
	c: Context<AppEnv>,
	input: CreateProductReviewInput
) => {
	const { productId, rating, body } = input;

	if (rating < 1 || rating > 5) {
		throw new LogicError(LogicErrorCode.ProductInvalidRating);
	}

	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const review = await ProductData.createProductReview(c.var.prisma, {
		productId,
		userId: c.var.auth.id,
		rating,
		...(body && { body })
	});

	c.var.services.analytics.track({
		event: 'product_review_created',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			rating,
			hasBody: !!body
		},
		groups: { store: product.storeId }
	});

	return review;
};

export const getFeaturedProducts = async (
	c: Context<AppEnv>,
	options: ProductData.GetFeaturedProductsOptions = {}
) => {
	return ProductData.getFeaturedProducts(c.var.prisma, options);
};

interface AddToWatchlistInput {
	productId: string;
}

export const addToWatchlist = async (
	c: Context<AppEnv>,
	input: AddToWatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const watchlistItem = await ProductData.addToWatchlist(
		c.var.prisma,
		c.var.auth.id,
		productId
	);

	c.var.services.analytics.track({
		event: 'product_added_to_watchlist',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			productName: product.name
		},
		groups: { store: product.storeId }
	});

	return watchlistItem;
};

interface RemoveFromWatchlistInput {
	productId: string;
}

export const removeFromWatchlist = async (
	c: Context<AppEnv>,
	input: RemoveFromWatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	await ProductData.removeFromWatchlist(c.var.prisma, c.var.auth.id, productId);

	c.var.services.analytics.track({
		event: 'product_removed_from_watchlist',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			productName: product.name
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const getRelatedProducts = async (
	c: Context<AppEnv>,
	productId: string
) => {
	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	return ProductData.getRelatedProducts(c.var.prisma, productId);
};

interface CreateProductOptionInput {
	productId: string;
	name: string;
	description: string | undefined;
}

export const createProductOption = async (
	c: Context<AppEnv>,
	input: CreateProductOptionInput
) => {
	const { productId, name, description } = input;

	const product = await ProductData.getProductById(c.var.prisma, productId);

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (c.var.storeId && c.var.storeId !== product.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const productOption = await ProductData.createProductOption(c.var.prisma, {
		productId,
		name,
		description
	});

	c.var.services.analytics.track({
		event: 'product_option_created',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			optionName: name,
			hasDescription: !!description
		},
		groups: { store: product.storeId }
	});

	return productOption;
};

interface UpdateProductCategoriesInput {
	productId: string;
	addCategoryIds: string[];
	removeCategoryIds: string[];
}

export const updateProductCategories = async (
	c: Context<AppEnv>,
	input: UpdateProductCategoriesInput
) => {
	const { productId, addCategoryIds, removeCategoryIds } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const existingProduct = await ProductData.getProductById(
		c.var.prisma,
		productId
	);

	if (!existingProduct) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (c.var.storeId && c.var.storeId !== existingProduct.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const product = await ProductData.updateProductCategories(c.var.prisma, {
		productId,
		addCategoryIds,
		removeCategoryIds
	});

	c.var.services.analytics.track({
		event: 'product_categories_updated',
		distinctId: c.var.auth.id,
		properties: {
			productId,
			categoriesAdded: addCategoryIds.length,
			categoriesRemoved: removeCategoryIds.length
		},
		groups: { store: existingProduct.storeId }
	});

	return product;
};

interface CreateStoreProductCategoryInput {
	name: string;
	description: string | undefined;
}

export const createStoreProductCategory = async (
	c: Context<AppEnv>,
	input: CreateStoreProductCategoryInput
) => {
	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreNotFound);
	}

	const category = await ProductData.createStoreProductCategory(c.var.prisma, {
		storeId: c.var.storeId,
		name: input.name,
		description: input.description
	});

	c.var.services.analytics.track({
		event: 'store_category_created',
		distinctId: c.var.auth.id,
		properties: {
			categoryId: category.id,
			categoryName: category.name,
			hasDescription: !!category.description
		},
		groups: { store: c.var.storeId }
	});

	return category;
};

interface UpdateStoreProductCategoryInput {
	categoryId: string;
	name?: string;
	description?: string;
}

export const updateStoreProductCategory = async (
	c: Context<AppEnv>,
	input: UpdateStoreProductCategoryInput
) => {
	const { categoryId, ...updateData } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreNotFound);
	}

	const category = await ProductData.updateStoreProductCategory(
		c.var.prisma,
		categoryId,
		updateData
	);

	c.var.services.analytics.track({
		event: 'store_category_updated',
		distinctId: c.var.auth.id,
		properties: {
			categoryId: category.id,
			categoryName: category.name,
			updatedFields: Object.keys(updateData)
		},
		groups: { store: c.var.storeId }
	});

	return category;
};

interface DeleteStoreProductCategoryInput {
	categoryId: string;
}

export const deleteStoreProductCategory = async (
	c: Context<AppEnv>,
	input: DeleteStoreProductCategoryInput
) => {
	const { categoryId } = input;

	if (!c.var.auth?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!c.var.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreNotFound);
	}

	const category = await ProductData.deleteStoreProductCategory(
		c.var.prisma,
		categoryId
	);

	c.var.services.analytics.track({
		event: 'store_category_deleted',
		distinctId: c.var.auth.id,
		properties: {
			categoryId: category.id,
			categoryName: category.name
		},
		groups: { store: c.var.storeId }
	});

	return category;
};

export const getStoreProductCategories = async (
	c: Context<AppEnv>,
	storeId: string
) => {
	return ProductData.getStoreProductCategories(c.var.prisma, storeId);
};

export const getProducts = async (
	c: Context<AppEnv>,
	filters?: ProductFilters
) => {
	return ProductData.getProducts(c.var.prisma, filters);
};
