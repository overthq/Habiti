import { ProductsArgs } from '../../types/filters';
import { Resolver } from '../../types/resolvers';

const product: Resolver = (_, { id }, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id } });
};

const products: Resolver<ProductsArgs> = (_, { filter, orderBy }, ctx) => {
	return ctx.prisma.product.findMany({ where: filter, orderBy });
};

interface OrdersArgs {
	orderBy?: {
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
		.categories();
};

// FIXME: Very hacky.
const inCart: Resolver = async (parent, _, ctx) => {
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
		inCart
	}
};
