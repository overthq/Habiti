import { ProductStatus, PrismaClient, Prisma } from '@prisma/client';

interface CreateProductParams {
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

interface UpdateProductParams {
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

interface CreateProductReviewParams {
	productId: string;
	userId: string;
	rating: number;
	body?: string;
}

export const createProduct = async (
	prisma: PrismaClient,
	params: CreateProductParams
) => {
	const { images, ...rest } = params;

	let args: Prisma.ProductCreateArgs['data'] = {
		...rest
	};

	if (images && images.length > 0) {
		args.images = {
			createMany: { data: images }
		};
	}

	const product = await prisma.product.create({
		data: {
			...args,
			quantity: params.quantity ?? 0,
			status: params.status ?? ProductStatus.Active
		}
	});

	return product;
};

export const updateProduct = async (
	prisma: PrismaClient,
	productId: string,
	params: UpdateProductParams
) => {
	const { images, ...rest } = params;

	let args: Prisma.ProductUpdateArgs['data'] = {
		...rest
	};

	if (images && images.length > 0) {
		args.images = {
			createMany: { data: images }
		};
	}

	const product = await prisma.product.update({
		where: { id: productId },
		data: args
	});

	return product;
};

export const getProductById = async (
	prisma: PrismaClient,
	productId: string
) => {
	const product = await prisma.product.findUnique({
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

export const getProductReviews = async (
	prisma: PrismaClient,
	productId: string
) => {
	const reviews = await prisma.productReview.findMany({
		where: { productId }
	});

	return reviews;
};

export const getProductsByStoreId = async (
	prisma: PrismaClient,
	storeId: string
) => {
	const products = await prisma.product.findMany({
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
	prisma: PrismaClient,
	productId: string
) => {
	await prisma.product.delete({
		where: { id: productId }
	});
};

export const updateProductQuantity = async (
	prisma: PrismaClient,
	productId: string,
	quantity: number
) => {
	const product = await prisma.product.update({
		where: { id: productId },
		data: { quantity }
	});

	return product;
};

export const incrementProductQuantity = async (
	prisma: PrismaClient,
	productId: string,
	increment: number
) => {
	const product = await prisma.product.update({
		where: { id: productId },
		data: { quantity: { increment } }
	});

	return product;
};

export const decrementProductQuantity = async (
	prisma: PrismaClient,
	productId: string,
	decrement: number
) => {
	const product = await prisma.product.update({
		where: { id: productId },
		data: { quantity: { decrement } }
	});

	return product;
};

export const createProductReview = async (
	prisma: PrismaClient,
	params: CreateProductReviewParams
) => {
	const review = await prisma.productReview.create({
		data: params
	});

	return review;
};

export const addToWatchlist = async (
	prisma: PrismaClient,
	userId: string,
	productId: string
) => {
	const watchlistItem = await prisma.watchlistProduct.create({
		data: {
			userId,
			productId
		}
	});

	return watchlistItem;
};

export const removeFromWatchlist = async (
	prisma: PrismaClient,
	userId: string,
	productId: string
) => {
	await prisma.watchlistProduct.delete({
		where: {
			userId_productId: {
				userId,
				productId
			}
		}
	});
};

export const getRelatedProducts = async (
	prisma: PrismaClient,
	productId: string
) => {
	const product = await prisma.product.findUnique({
		where: { id: productId },
		include: {
			store: true,
			images: true,
			categories: { include: { category: true } }
		}
	});

	if (!product) {
		throw new Error('Product not found');
	}

	let relatedProducts = await prisma.product.findMany({
		where: {
			storeId: product.storeId,
			categories: {
				some: { categoryId: { in: product.categories.map(c => c.categoryId) } }
			}
		},
		take: 5
	});

	if (relatedProducts.length === 0) {
		relatedProducts = await prisma.product.findMany({
			where: { storeId: product.storeId },
			take: 5
		});
	}

	return relatedProducts;
};
