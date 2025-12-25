import { ProductStatus } from '../../generated/prisma/client';
import * as ProductData from '../data/products';
import { AppContext } from '../../utils/context';
import { canManageStore } from './permissions';
import { err, ok, Result } from './result';
import { LogicErrorCode } from './errors';

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
): Promise<
	Result<Awaited<ReturnType<typeof ProductData.createProduct>>, LogicErrorCode>
> => {
	const { storeId, ...productData } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (ctx.storeId && ctx.storeId !== storeId) {
			return err(LogicErrorCode.ProductStoreMismatch);
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

		return ok(product);
	} catch (e) {
		console.error('[ProductLogic.createProduct] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
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
): Promise<
	Result<Awaited<ReturnType<typeof ProductData.updateProduct>>, LogicErrorCode>
> => {
	const { productId, ...updateData } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const existingProduct = await ProductData.getProductById(
			ctx.prisma,
			productId
		);

		if (!existingProduct) {
			return err(LogicErrorCode.ProductNotFound);
		}

		let isManager = false;
		try {
			isManager = await canManageStore(ctx);
		} catch {
			// canManageStore currently throws for unauth/store missing; treat as forbidden here
			isManager = false;
		}

		if (!isManager) {
			return err(LogicErrorCode.Forbidden);
		}

		const userIsAdmin = await ctx.isAdmin();

		if (
			ctx.storeId &&
			ctx.storeId !== existingProduct.storeId &&
			!userIsAdmin
		) {
			return err(LogicErrorCode.ProductStoreMismatch);
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

		return ok(product);
	} catch (e) {
		console.error('[ProductLogic.updateProduct] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getProductById = async (
	ctx: AppContext,
	productId: string
): Promise<
	Result<
		{
			product: Awaited<ReturnType<typeof ProductData.getProductById>>;
			viewerContext: Awaited<
				ReturnType<typeof ProductData.getProductViewerContext>
			> | null;
		},
		LogicErrorCode
	>
> => {
	try {
		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
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

		return ok({ product, viewerContext: productViewerContext });
	} catch (e) {
		console.error('[ProductLogic.getProductById] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getProductReviews = async (
	ctx: AppContext,
	productId: string
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.getProductReviews>>,
		LogicErrorCode
	>
> => {
	try {
		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		return ok(await ProductData.getProductReviews(ctx.prisma, productId));
	} catch (e) {
		console.error('[ProductLogic.getProductReviews] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getProductsByStoreId = async (
	ctx: AppContext,
	storeId: string
) => {
	try {
		return ok(await ProductData.getProductsByStoreId(ctx.prisma, storeId));
	} catch (e) {
		console.error('[ProductLogic.getProductsByStoreId] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface DeleteProductInput {
	productId: string;
}

export const deleteProduct = async (
	ctx: AppContext,
	input: DeleteProductInput
): Promise<
	Result<Awaited<ReturnType<typeof ProductData.getProductById>>, LogicErrorCode>
> => {
	const { productId } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		if (ctx.storeId && ctx.storeId !== product.storeId) {
			return err(LogicErrorCode.ProductStoreMismatch);
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

		return ok(product);
	} catch (e) {
		console.error('[ProductLogic.deleteProduct] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface CreateProductReviewInput {
	productId: string;
	rating: number;
	body: string | undefined;
}

export const createProductReview = async (
	ctx: AppContext,
	input: CreateProductReviewInput
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.createProductReview>>,
		LogicErrorCode
	>
> => {
	const { productId, rating, body } = input;

	try {
		if (rating < 1 || rating > 5) {
			return err(LogicErrorCode.ProductInvalidRating);
		}

		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
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

		return ok(review);
	} catch (e) {
		console.error('[ProductLogic.createProductReview] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getFeaturedProducts = async (
	ctx: AppContext,
	options: ProductData.GetFeaturedProductsOptions = {}
) => {
	try {
		return ok(await ProductData.getFeaturedProducts(ctx.prisma, options));
	} catch (e) {
		console.error('[ProductLogic.getFeaturedProducts] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface AddToWatchlistInput {
	productId: string;
}

export const addToWatchlist = async (
	ctx: AppContext,
	input: AddToWatchlistInput
): Promise<
	Result<Awaited<ReturnType<typeof ProductData.addToWatchlist>>, LogicErrorCode>
> => {
	const { productId } = input;

	try {
		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
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

		return ok(watchlistItem);
	} catch (e) {
		console.error('[ProductLogic.addToWatchlist] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface RemoveFromWatchlistInput {
	productId: string;
}

export const removeFromWatchlist = async (
	ctx: AppContext,
	input: RemoveFromWatchlistInput
): Promise<
	Result<Awaited<ReturnType<typeof ProductData.getProductById>>, LogicErrorCode>
> => {
	const { productId } = input;

	try {
		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
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

		return ok(product);
	} catch (e) {
		console.error('[ProductLogic.removeFromWatchlist] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getRelatedProducts = async (
	ctx: AppContext,
	productId: string
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.getRelatedProducts>>,
		LogicErrorCode
	>
> => {
	try {
		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		return ok(await ProductData.getRelatedProducts(ctx.prisma, productId));
	} catch (e) {
		console.error('[ProductLogic.getRelatedProducts] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface CreateProductOptionInput {
	productId: string;
	name: string;
	description: string | undefined;
}

export const createProductOption = async (
	ctx: AppContext,
	input: CreateProductOptionInput
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.createProductOption>>,
		LogicErrorCode
	>
> => {
	const { productId, name, description } = input;

	try {
		const product = await ProductData.getProductById(ctx.prisma, productId);

		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (!product) {
			return err(LogicErrorCode.ProductNotFound);
		}

		if (ctx.storeId && ctx.storeId !== product.storeId) {
			return err(LogicErrorCode.ProductStoreMismatch);
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

		return ok(productOption);
	} catch (e) {
		console.error('[ProductLogic.createProductOption] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface UpdateProductCategoriesInput {
	productId: string;
	addCategoryIds: string[];
	removeCategoryIds: string[];
}

export const updateProductCategories = async (
	ctx: AppContext,
	input: UpdateProductCategoriesInput
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.updateProductCategories>>,
		LogicErrorCode
	>
> => {
	const { productId, addCategoryIds, removeCategoryIds } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		const existingProduct = await ProductData.getProductById(
			ctx.prisma,
			productId
		);

		if (!existingProduct) {
			return err(LogicErrorCode.ProductNotFound);
		}

		if (ctx.storeId && ctx.storeId !== existingProduct.storeId) {
			return err(LogicErrorCode.ProductStoreMismatch);
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

		return ok(product);
	} catch (e) {
		console.error('[ProductLogic.updateProductCategories] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};

interface CreateStoreProductCategoryInput {
	name: string;
	description: string | undefined;
}

export const createStoreProductCategory = async (
	ctx: AppContext,
	input: CreateStoreProductCategoryInput
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.createStoreProductCategory>>,
		LogicErrorCode
	>
> => {
	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (!ctx.storeId) {
			return err(LogicErrorCode.ProductStoreNotFound);
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

		return ok(category);
	} catch (e) {
		console.error(
			'[ProductLogic.createStoreProductCategory] Unexpected error',
			e
		);
		return err(LogicErrorCode.Unexpected);
	}
};

interface UpdateStoreProductCategoryInput {
	categoryId: string;
	name?: string;
	description?: string;
}

export const updateStoreProductCategory = async (
	ctx: AppContext,
	input: UpdateStoreProductCategoryInput
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.updateStoreProductCategory>>,
		LogicErrorCode
	>
> => {
	const { categoryId, ...updateData } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (!ctx.storeId) {
			return err(LogicErrorCode.ProductStoreNotFound);
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

		return ok(category);
	} catch (e) {
		console.error(
			'[ProductLogic.updateStoreProductCategory] Unexpected error',
			e
		);
		return err(LogicErrorCode.Unexpected);
	}
};

interface DeleteStoreProductCategoryInput {
	categoryId: string;
}

export const deleteStoreProductCategory = async (
	ctx: AppContext,
	input: DeleteStoreProductCategoryInput
): Promise<
	Result<
		Awaited<ReturnType<typeof ProductData.deleteStoreProductCategory>>,
		LogicErrorCode
	>
> => {
	const { categoryId } = input;

	try {
		if (!ctx.user?.id) {
			return err(LogicErrorCode.NotAuthenticated);
		}

		if (!ctx.storeId) {
			return err(LogicErrorCode.ProductStoreNotFound);
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

		return ok(category);
	} catch (e) {
		console.error(
			'[ProductLogic.deleteStoreProductCategory] Unexpected error',
			e
		);
		return err(LogicErrorCode.Unexpected);
	}
};

export const getProducts = async (ctx: AppContext, query: any) => {
	try {
		return ok(await ProductData.getProducts(ctx.prisma, query));
	} catch (e) {
		console.error('[ProductLogic.getProducts] Unexpected error', e);
		return err(LogicErrorCode.Unexpected);
	}
};
