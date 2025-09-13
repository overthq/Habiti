import { ProductStatus } from '@prisma/client';
import * as ProductData from '../data/products';
import { AppContext } from '../../utils/context';

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
	body?: string;
}

interface UpdateProductQuantityInput {
	productId: string;
	quantity: number;
}

interface IncrementProductQuantityInput {
	productId: string;
	increment: number;
}

interface DecrementProductQuantityInput {
	productId: string;
	decrement: number;
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

	ctx.services.analytics.track({
		event: 'product_viewed',
		distinctId: ctx.user.id,
		properties: {
			productId: product.id,
			productName: product.name,
			unitPrice: product.unitPrice
		},
		groups: { store: product.storeId }
	});

	return product;
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

	return { success: true };
};

export const updateProductQuantity = async (
	ctx: AppContext,
	input: UpdateProductQuantityInput
) => {
	const { productId, quantity } = input;

	if (quantity < 0) {
		throw new Error('Quantity cannot be negative');
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

	const product = await ProductData.updateProductQuantity(
		ctx.prisma,
		productId,
		quantity
	);

	ctx.services.analytics.track({
		event: 'product_quantity_updated',
		distinctId: ctx.user.id,
		properties: {
			productId: product.id,
			previousQuantity: existingProduct.quantity,
			newQuantity: quantity,
			difference: quantity - existingProduct.quantity
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const incrementProductQuantity = async (
	ctx: AppContext,
	input: IncrementProductQuantityInput
) => {
	const { productId, increment } = input;

	if (increment <= 0) {
		throw new Error('Increment must be positive');
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

	const product = await ProductData.incrementProductQuantity(
		ctx.prisma,
		productId,
		increment
	);

	ctx.services.analytics.track({
		event: 'product_quantity_incremented',
		distinctId: ctx.user.id,
		properties: {
			productId: product.id,
			increment,
			newQuantity: product.quantity
		},
		groups: { store: product.storeId }
	});

	return product;
};

export const decrementProductQuantity = async (
	ctx: AppContext,
	input: DecrementProductQuantityInput
) => {
	const { productId, decrement } = input;

	if (decrement <= 0) {
		throw new Error('Decrement must be positive');
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

	if (existingProduct.quantity < decrement) {
		throw new Error('Cannot decrement quantity below zero');
	}

	const product = await ProductData.decrementProductQuantity(
		ctx.prisma,
		productId,
		decrement
	);

	ctx.services.analytics.track({
		event: 'product_quantity_decremented',
		distinctId: ctx.user.id,
		properties: {
			productId: product.id,
			decrement,
			newQuantity: product.quantity
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

export const addToWatchlist = async (
	ctx: AppContext,
	input: WatchlistInput
) => {
	const { productId } = input;

	const product = await ProductData.getProductById(ctx.prisma, productId);

	if (!product) {
		throw new Error('Product not found');
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

	return { success: true };
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
