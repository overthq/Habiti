import { ProductStatus, PrismaClient, Prisma } from '@prisma/client';
import {
	productFiltersToPrismaClause,
	ProductFilters
} from '../../utils/queries';

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

interface UpdateProductImagesParams {
	productId: string;
	addImages: {
		path: string;
		publicId: string;
	}[];
	removeImageIds: string[];
}

export const updateProductImages = async (
	prisma: PrismaClient,
	params: UpdateProductImagesParams
) => {
	const { productId, addImages, removeImageIds } = params;

	const existingProduct = await prisma.product.findUnique({
		where: { id: productId }
	});

	if (!existingProduct) {
		throw new Error(`Product ${productId} not found`);
	}

	const product = await prisma.product.update({
		where: { id: productId },
		data: {
			images: {
				createMany: { data: addImages },
				deleteMany: { id: { in: removeImageIds } }
			}
		},
		include: {
			images: true,
			store: true,
			categories: { include: { category: true } },
			reviews: { include: { user: true } }
		}
	});

	return product;
};

interface CreateProductOptionParams {
	productId: string;
	name: string;
	description: string | undefined;
}

export const createProductOption = async (
	prisma: PrismaClient,
	params: CreateProductOptionParams
) => {
	const productOption = await prisma.productOption.create({
		data: {
			productId: params.productId,
			name: params.name,
			description: params.description ?? null
		}
	});

	return productOption;
};

interface UpdateProductCategoriesParams {
	productId: string;
	addCategoryIds: string[];
	removeCategoryIds: string[];
}

export const updateProductCategories = async (
	prisma: PrismaClient,
	params: UpdateProductCategoriesParams
) => {
	const { productId, addCategoryIds, removeCategoryIds } = params;

	const existingProduct = await prisma.product.findUnique({
		where: { id: productId }
	});

	if (!existingProduct) {
		throw new Error(`Product ${productId} not found`);
	}

	const product = await prisma.product.update({
		where: { id: productId },
		data: {
			categories: {
				deleteMany: {
					categoryId: { in: removeCategoryIds }
				},
				createMany: {
					data: addCategoryIds.map(categoryId => ({ categoryId }))
				}
			}
		},
		include: {
			categories: { include: { category: true } },
			images: true,
			store: true,
			reviews: { include: { user: true } }
		}
	});

	return product;
};

export interface GetFeaturedProductsOptions {
	take?: number;
}

export const getFeaturedProducts = async (
	prisma: PrismaClient,
	options: GetFeaturedProductsOptions = {}
) => {
	const take = options.take ?? 8;

	const products = await prisma.product.findMany({
		where: {
			status: ProductStatus.Active,
			store: { unlisted: false }
		},
		include: {
			images: true,
			store: {
				include: {
					image: true
				}
			}
		},
		orderBy: [{ watchlists: { _count: 'desc' } }, { createdAt: 'desc' }],
		take
	});

	return products;
};

interface CreateStoreProductCategoryParams {
	storeId: string;
	name: string;
	description: string | undefined;
}

export const createStoreProductCategory = async (
	prisma: PrismaClient,
	params: CreateStoreProductCategoryParams
) => {
	const category = await prisma.storeProductCategory.create({
		data: {
			storeId: params.storeId,
			name: params.name,
			description: params.description ?? null
		}
	});

	return category;
};

interface UpdateStoreProductCategoryParams {
	name?: string;
	description?: string;
}

export const updateStoreProductCategory = async (
	prisma: PrismaClient,
	categoryId: string,
	params: UpdateStoreProductCategoryParams
) => {
	const category = await prisma.storeProductCategory.update({
		where: { id: categoryId },
		data: params
	});

	return category;
};

export const deleteStoreProductCategory = async (
	prisma: PrismaClient,
	categoryId: string
) => {
	const category = await prisma.storeProductCategory.delete({
		where: { id: categoryId }
	});

	return category;
};

export const getProductViewerContext = async (
	prisma: PrismaClient,
	userId: string,
	productId: string
) => {
	const cartProduct = await prisma.cartProduct.findFirst({
		where: { cart: { userId }, productId }
	});

	return { cartProduct };
};

export const getProducts = async (
	prisma: PrismaClient,
	filters: ProductFilters
) => {
	const products = await prisma.product.findMany({
		include: {
			store: true,
			images: true,
			categories: { include: { category: true } }
		},
		...productFiltersToPrismaClause(filters)
	});

	return products;
};
