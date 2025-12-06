import { ProductStatus } from '@prisma/client';
import * as ProductData from '../data/products';
import { AppContext } from '../../utils/context';
import { canManageStore } from './permissions';

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

interface CreateProductReviewInput {
	productId: string;
	rating: number;
	body: string | undefined;
}

interface WatchlistInput {
	productId: string;
}

interface DeleteProductInput {
	productId: string;
}

export const createProduct = async (
	ctx: AppContext,
	input: CreateProductInput
) => {
	const { storeId, ...productData } = input;

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	if (ctx.storeId && ctx.storeId !== storeId) {
		throw new Error('Unauthorized: Cannot create products for different store');
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

export const updateProduct = async (
	ctx: AppContext,
	input: UpdateProductInput
) => {
	const { productId, ...updateData } = input;

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	const existingProduct = await ProductData.getProductById(
		ctx.prisma,
		productId
	);

	if (!existingProduct) {
		throw new Error('Product not found');
	}

	const isManager = await canManageStore(ctx);

	if (!isManager) {
		throw new Error('You must be a store manager to carry out this action');
	}

	const userIsAdmin = await ctx.isAdmin();

	if (ctx.storeId && ctx.storeId !== existingProduct.storeId && !userIsAdmin) {
		throw new Error(
			'Unauthorized: Cannot update products from different store'
		);
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
		throw new Error('Product not found');
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
		throw new Error('Product not found');
	}

	return ProductData.getProductReviews(ctx.prisma, productId);
};

export const getProductsByStoreId = async (
	ctx: AppContext,
	storeId: string
) => {
	return ProductData.getProductsByStoreId(ctx.prisma, storeId);
};

export const deleteProduct = async (
	ctx: AppContext,
	input: DeleteProductInput
) => {
	const { productId } = input;

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new Error('Product not found');
	}

	if (ctx.storeId && ctx.storeId !== product.storeId) {
		throw new Error(
			'Unauthorized: Cannot delete products from different store'
		);
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

export const createProductReview = async (
	ctx: AppContext,
	input: CreateProductReviewInput
) => {
	const { productId, rating, body } = input;

	if (rating < 1 || rating > 5) {
		throw new Error('Rating must be between 1 and 5');
	}

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new Error('Product not found');
	}

	if (!ctx.user?.id) {
		throw new Error('User not authenticated.');
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

export const addToWatchlist = async (
	ctx: AppContext,
	input: WatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new Error('Product not found');
	}

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
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

export const removeFromWatchlist = async (
	ctx: AppContext,
	input: WatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new Error('Product not found');
	}

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
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
		throw new Error('Product not found');
	}

	return ProductData.getRelatedProducts(ctx.prisma, productId);
};

interface UpdateProductImagesInput {
	productId: string;
	addImages: {
		path: string;
		publicId: string;
	}[];
	removeImageIds: string[];
}

interface CreateProductOptionInput {
	productId: string;
	name: string;
	description: string | undefined;
}

interface UpdateProductCategoriesInput {
	productId: string;
	addCategoryIds: string[];
	removeCategoryIds: string[];
}

interface CreateStoreProductCategoryInput {
	name: string;
	description: string | undefined;
}

interface UpdateStoreProductCategoryInput {
	categoryId: string;
	name?: string;
	description?: string;
}

interface DeleteStoreProductCategoryInput {
	categoryId: string;
}

export const updateProductImages = async (
	ctx: AppContext,
	input: UpdateProductImagesInput
) => {
	const { productId, addImages, removeImageIds } = input;

	if (!ctx.user?.id) {
		throw new Error('User is not authenticated');
	}

	const existingProduct = await ProductData.getProductById(
		ctx.prisma,
		productId
	);

	if (!existingProduct) {
		throw new Error('Product not found');
	}

	if (ctx.storeId && ctx.storeId !== existingProduct.storeId) {
		throw new Error(
			'Unauthorized: Cannot update products from different store'
		);
	}

	const product = await ProductData.updateProductImages(ctx.prisma, {
		productId,
		addImages,
		removeImageIds
	});

	ctx.services.analytics.track({
		event: 'product_images_updated',
		distinctId: ctx.user.id,
		properties: {
			productId: product.id,
			imagesAdded: addImages.length,
			imagesRemoved: removeImageIds.length
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const createProductOption = async (
	ctx: AppContext,
	input: CreateProductOptionInput
) => {
	const { productId, name, description } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!ctx.user?.id) {
		throw new Error('User is not authenticated');
	}

	if (!product) {
		throw new Error('Product not found');
	}

	if (ctx.storeId && ctx.storeId !== product.storeId) {
		throw new Error(
			'Unauthorized: Cannot create options for products from different store'
		);
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

export const updateProductCategories = async (
	ctx: AppContext,
	input: UpdateProductCategoriesInput
) => {
	const { productId, addCategoryIds, removeCategoryIds } = input;

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	const existingProduct = await ProductData.getProductById(
		ctx.prisma,
		productId
	);

	if (!existingProduct) {
		throw new Error('Product not found');
	}

	if (ctx.storeId && ctx.storeId !== existingProduct.storeId) {
		throw new Error(
			'Unauthorized: Cannot update products from different store'
		);
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

export const createStoreProductCategory = async (
	ctx: AppContext,
	input: CreateStoreProductCategoryInput
) => {
	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	if (!ctx.storeId) {
		throw new Error('Store not found');
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

export const updateStoreProductCategory = async (
	ctx: AppContext,
	input: UpdateStoreProductCategoryInput
) => {
	const { categoryId, ...updateData } = input;

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	if (!ctx.storeId) {
		throw new Error('Store not found');
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

export const deleteStoreProductCategory = async (
	ctx: AppContext,
	input: DeleteStoreProductCategoryInput
) => {
	const { categoryId } = input;

	if (!ctx.user?.id) {
		throw new Error('User not authenticated');
	}

	if (!ctx.storeId) {
		throw new Error('Store not found');
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
