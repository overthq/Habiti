import { ProductStatus } from '../../generated/prisma/client';
import * as ProductData from '../data/products';
import { AppContext } from '../../utils/context';
import { canManageStore } from './permissions';
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
	ctx: AppContext,
	input: CreateProductInput
) => {
	const { storeId, ...productData } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const userIsAdmin = await ctx.isAdmin();

	if (ctx.storeId && ctx.storeId !== storeId && !userIsAdmin) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const product = await ProductData.createProduct(ctx.prisma, {
		...productData,
		storeId
	});

	ctx.services.analytics.track({
		event: 'product_created',
		distinctId: ctx.user.id,
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
	name?: string;
	description?: string;
	unitPrice?: number;
	quantity?: number;
	categoryId?: string;
	status?: ProductStatus;
	images?: {
		path: string;
		publicId: string;
	}[];
}

export const updateProduct = async (
	ctx: AppContext,
	input: UpdateProductInput
) => {
	const { productId, ...updateData } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const existingProduct = await ProductData.getProductById(
		ctx.prisma,
		productId
	);

	if (!existingProduct) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	const isManager = await canManageStore(ctx);

	if (!isManager) {
		throw new LogicError(LogicErrorCode.Forbidden);
	}

	const userIsAdmin = await ctx.isAdmin();

	if (ctx.storeId && ctx.storeId !== existingProduct.storeId && !userIsAdmin) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const product = await ProductData.updateProduct(
		ctx.prisma,
		productId,
		updateData
	);

	ctx.services.analytics.track({
		event: 'product_updated',
		distinctId: ctx.user.id,
		properties: {
			productId: product.id,
			productName: product.name,
			updatedFields: Object.keys(updateData)
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const getProductById = async (ctx: AppContext, productId: string) => {
	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	const productViewerContext = ctx.user?.id
		? await ProductData.getProductViewerContext(
				ctx.prisma,
				ctx.user.id,
				product.id
			)
		: null;

	if (ctx.user?.id) {
		ctx.services.analytics.track({
			event: 'product_viewed',
			distinctId: ctx.user?.id,
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

export const getProductReviews = async (ctx: AppContext, productId: string) => {
	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	return ProductData.getProductReviews(ctx.prisma, productId);
};

export const getProductsByStoreId = async (
	ctx: AppContext,
	storeId: string
) => {
	return ProductData.getProductsByStoreId(ctx.prisma, storeId);
};

interface DeleteProductInput {
	productId: string;
}

export const deleteProduct = async (
	ctx: AppContext,
	input: DeleteProductInput
) => {
	const { productId } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (ctx.storeId && ctx.storeId !== product.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	await ProductData.deleteProduct(ctx.prisma, productId);

	ctx.services.analytics.track({
		event: 'product_deleted',
		distinctId: ctx.user.id,
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
	ctx: AppContext,
	input: CreateProductReviewInput
) => {
	const { productId, rating, body } = input;

	if (rating < 1 || rating > 5) {
		throw new LogicError(LogicErrorCode.ProductInvalidRating);
	}

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const review = await ProductData.createProductReview(ctx.prisma, {
		productId,
		userId: ctx.user.id,
		rating,
		...(body && { body })
	});

	ctx.services.analytics.track({
		event: 'product_review_created',
		distinctId: ctx.user.id,
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
	ctx: AppContext,
	options: ProductData.GetFeaturedProductsOptions = {}
) => {
	return ProductData.getFeaturedProducts(ctx.prisma, options);
};

interface AddToWatchlistInput {
	productId: string;
}

export const addToWatchlist = async (
	ctx: AppContext,
	input: AddToWatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const watchlistItem = await ProductData.addToWatchlist(
		ctx.prisma,
		ctx.user.id,
		productId
	);

	ctx.services.analytics.track({
		event: 'product_added_to_watchlist',
		distinctId: ctx.user.id,
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
	ctx: AppContext,
	input: RemoveFromWatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	await ProductData.removeFromWatchlist(ctx.prisma, ctx.user.id, productId);

	ctx.services.analytics.track({
		event: 'product_removed_from_watchlist',
		distinctId: ctx.user.id,
		properties: {
			productId,
			productName: product.name
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const getRelatedProducts = async (
	ctx: AppContext,
	productId: string
) => {
	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	return ProductData.getRelatedProducts(ctx.prisma, productId);
};

interface CreateProductOptionInput {
	productId: string;
	name: string;
	description: string | undefined;
}

export const createProductOption = async (
	ctx: AppContext,
	input: CreateProductOptionInput
) => {
	const { productId, name, description } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!product) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (ctx.storeId && ctx.storeId !== product.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const productOption = await ProductData.createProductOption(ctx.prisma, {
		productId,
		name,
		description
	});

	ctx.services.analytics.track({
		event: 'product_option_created',
		distinctId: ctx.user.id,
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
	ctx: AppContext,
	input: UpdateProductCategoriesInput
) => {
	const { productId, addCategoryIds, removeCategoryIds } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	const existingProduct = await ProductData.getProductById(
		ctx.prisma,
		productId
	);

	if (!existingProduct) {
		throw new LogicError(LogicErrorCode.ProductNotFound);
	}

	if (ctx.storeId && ctx.storeId !== existingProduct.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreMismatch);
	}

	const product = await ProductData.updateProductCategories(ctx.prisma, {
		productId,
		addCategoryIds,
		removeCategoryIds
	});

	ctx.services.analytics.track({
		event: 'product_categories_updated',
		distinctId: ctx.user.id,
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
	ctx: AppContext,
	input: CreateStoreProductCategoryInput
) => {
	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreNotFound);
	}

	const category = await ProductData.createStoreProductCategory(ctx.prisma, {
		storeId: ctx.storeId,
		name: input.name,
		description: input.description
	});

	ctx.services.analytics.track({
		event: 'store_category_created',
		distinctId: ctx.user.id,
		properties: {
			categoryId: category.id,
			categoryName: category.name,
			hasDescription: !!category.description
		},
		groups: { store: ctx.storeId }
	});

	return category;
};

interface UpdateStoreProductCategoryInput {
	categoryId: string;
	name?: string;
	description?: string;
}

export const updateStoreProductCategory = async (
	ctx: AppContext,
	input: UpdateStoreProductCategoryInput
) => {
	const { categoryId, ...updateData } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreNotFound);
	}

	const category = await ProductData.updateStoreProductCategory(
		ctx.prisma,
		categoryId,
		updateData
	);

	ctx.services.analytics.track({
		event: 'store_category_updated',
		distinctId: ctx.user.id,
		properties: {
			categoryId: category.id,
			categoryName: category.name,
			updatedFields: Object.keys(updateData)
		},
		groups: { store: ctx.storeId }
	});

	return category;
};

interface DeleteStoreProductCategoryInput {
	categoryId: string;
}

export const deleteStoreProductCategory = async (
	ctx: AppContext,
	input: DeleteStoreProductCategoryInput
) => {
	const { categoryId } = input;

	if (!ctx.user?.id) {
		throw new LogicError(LogicErrorCode.NotAuthenticated);
	}

	if (!ctx.storeId) {
		throw new LogicError(LogicErrorCode.ProductStoreNotFound);
	}

	const category = await ProductData.deleteStoreProductCategory(
		ctx.prisma,
		categoryId
	);

	ctx.services.analytics.track({
		event: 'store_category_deleted',
		distinctId: ctx.user.id,
		properties: {
			categoryId: category.id,
			categoryName: category.name
		},
		groups: { store: ctx.storeId }
	});

	return category;
};

export const getProducts = async (ctx: AppContext, query: any) => {
	return ProductData.getProducts(ctx.prisma, query);
};
