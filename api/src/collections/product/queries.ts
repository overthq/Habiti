import { Resolver } from '../../types/resolvers';

const product: Resolver = async (_, { id }, ctx) => {
	const fetchedProduct = await ctx.prisma.product.findUnique({ where: { id } });

	return fetchedProduct;
};

const storeProducts: Resolver = async (_, { storeId }, ctx) => {
	const products = await ctx.prisma.product.findMany({ where: { storeId } });

	return products;
};

const orders: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).orders();
};

const carts: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).orders();
};

const store: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).store();
};

const images: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.product.findUnique({ where: { id: parent.id } }).images();
};

// TODO: Very hacky and bad.
const inCart: Resolver = async (parent, _, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId: ctx.user.id, storeId: parent.storeId } }
	});

	if (fetchedCart) {
		const fetchedCartProduct = await ctx.prisma.cartProduct.findUnique({
			where: {
				cartId_productId: {
					cartId: fetchedCart.id,
					productId: parent.id
				}
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
		storeProducts
	},
	Product: {
		orders,
		carts,
		store,
		images,
		inCart
	}
};
