import { ProductStatus } from '@prisma/client';
import { ResolverContext } from '../../types/resolvers';

interface CreateProductParams {
	name: string;
	description: string;
	unitPrice: number;
	quantity?: number;
	storeId: string;
	categoryId?: string;
	status?: ProductStatus;
}

interface UpdateProductParams {
	name?: string;
	description?: string;
	unitPrice?: number;
	quantity?: number;
	categoryId?: string;
	status?: ProductStatus;
}

interface CreateProductReviewParams {
	productId: string;
	userId: string;
	rating: number;
	comment?: string;
}

export const createProduct = async (
	ctx: ResolverContext,
	params: CreateProductParams
) => {
	const product = await ctx.prisma.product.create({
		data: {
			...params,
			quantity: params.quantity ?? 0,
			status: params.status ?? ProductStatus.Active
		}
	});

	return product;
};

export const updateProduct = async (
	ctx: ResolverContext,
	productId: string,
	params: UpdateProductParams
) => {
	const product = await ctx.prisma.product.update({
		where: { id: productId },
		data: params
	});

	return product;
};

export const getProductById = async (
	ctx: ResolverContext,
	productId: string
) => {
	const product = await ctx.prisma.product.findUnique({
		where: { id: productId },
		include: {
			store: true,
			images: true,
			categories: { include: { category: true } },
			reviews: {
				include: { user: true }
			}
		}
	});

	return product;
};

export const getProductsByStoreId = async (
	ctx: ResolverContext,
	storeId: string
) => {
	const products = await ctx.prisma.product.findMany({
		where: { storeId },
		include: {
			images: true,
			categories: { include: { category: true } }
		},
		orderBy: { createdAt: 'desc' }
	});

	return products;
};

export const deleteProduct = async (
	ctx: ResolverContext,
	productId: string
) => {
	await ctx.prisma.product.delete({
		where: { id: productId }
	});
};

export const updateProductQuantity = async (
	ctx: ResolverContext,
	productId: string,
	quantity: number
) => {
	const product = await ctx.prisma.product.update({
		where: { id: productId },
		data: { quantity }
	});

	return product;
};

export const incrementProductQuantity = async (
	ctx: ResolverContext,
	productId: string,
	increment: number
) => {
	const product = await ctx.prisma.product.update({
		where: { id: productId },
		data: { quantity: { increment } }
	});

	return product;
};

export const decrementProductQuantity = async (
	ctx: ResolverContext,
	productId: string,
	decrement: number
) => {
	const product = await ctx.prisma.product.update({
		where: { id: productId },
		data: { quantity: { decrement } }
	});

	return product;
};

export const createProductReview = async (
	ctx: ResolverContext,
	params: CreateProductReviewParams
) => {
	const review = await ctx.prisma.productReview.create({
		data: params
	});

	return review;
};

export const addToWatchlist = async (
	ctx: ResolverContext,
	productId: string
) => {
	const watchlistItem = await ctx.prisma.watchlistProduct.create({
		data: {
			userId: ctx.user.id,
			productId
		}
	});

	return watchlistItem;
};

export const removeFromWatchlist = async (
	ctx: ResolverContext,
	productId: string
) => {
	await ctx.prisma.watchlistProduct.delete({
		where: {
			userId_productId: {
				userId: ctx.user.id,
				productId
			}
		}
	});
};
