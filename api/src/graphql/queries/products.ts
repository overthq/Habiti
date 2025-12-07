import { Prisma } from '@prisma/client';

import { ProductsArgs } from '../../types/filters';
import { PaginationArgs } from '../../types/pagination';
import { Resolver } from '../../types/resolvers';
import { decodeCursor, paginateQuery } from '../../utils/pagination';

const product: Resolver = (_, { id }, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id } });
};

const products: Resolver<ProductsArgs & PaginationArgs> = async (
	_,
	args,
	ctx
) => {
	const { filter, orderBy, ...paginationArgs } = args;

	return paginateQuery(
		paginationArgs,
		async (take, cursor) => {
			let query: Prisma.ProductFindManyArgs = {
				where: filter,
				orderBy,
				take
			};

			if (cursor) {
				query.cursor = { id: decodeCursor(cursor) };
				query.skip = 1;
			}

			return ctx.prisma.product.findMany(query);
		},
		() => ctx.prisma.product.count({ where: filter })
	);
};

export interface OrdersArgs {
	orderBy: {
		createdAt?: 'asc' | 'desc';
		updatedAt?: 'asc' | 'desc';
	};
}

const orders: Resolver<OrdersArgs> = (parent, { orderBy }, ctx) => {
	return ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.orders({ orderBy: { order: orderBy } });
};

const carts: Resolver = (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).orders();
};

const store: Resolver = (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).store();
};

const images: Resolver = (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).images();
};

const categories: Resolver = (parent, _, ctx) => {
	return ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.categories({ include: { category: true } });
};

const options: Resolver = (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).options();
};

const reviews: Resolver = (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).reviews();
};

// FIXME: Very hacky.
const inCart: Resolver = async (parent, _, ctx) => {
	if (!ctx.user?.id) {
		return false;
	}

	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId: ctx.user.id, storeId: parent.storeId } }
	});

	if (fetchedCart) {
		const fetchedCartProduct = await ctx.prisma.cartProduct.findUnique({
			where: {
				cartId_productId: { cartId: fetchedCart.id, productId: parent.id }
			}
		});
		return !!fetchedCartProduct;
	} else {
		return false;
	}
};

const relatedProducts: Resolver = async (parent, _, ctx) => {
	// Get the current product's categories
	const productCategories = await ctx.prisma.productCategory.findMany({
		where: { productId: parent.id },
		select: { categoryId: true }
	});

	const categoryIds = productCategories.map(pc => pc.categoryId);

	// Find products that share categories with the current product
	if (categoryIds.length > 0) {
		return ctx.prisma.product.findMany({
			where: {
				AND: [
					{ id: { not: parent.id } }, // Exclude current product
					{ storeId: parent.storeId }, // Same store
					{
						categories: {
							some: {
								categoryId: { in: categoryIds }
							}
						}
					}
				]
			},
			take: 5 // Limit to 5 related products
		});
	}

	// Fallback: if no categories, return other products from same store
	return ctx.prisma.product.findMany({
		where: {
			AND: [{ id: { not: parent.id } }, { storeId: parent.storeId }]
		},
		take: 5
	});
};

export default {
	Query: {
		product,
		products
	},
	Product: {
		orders,
		carts,
		store,
		images,
		categories,
		options,
		reviews,
		inCart,
		relatedProducts
	}
};
