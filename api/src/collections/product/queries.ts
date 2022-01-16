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
	const fetchedOrders = await ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.orders();

	return fetchedOrders;
};

const carts: Resolver = async (parent, _, ctx) => {
	const fetchedCarts = await ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.orders();

	return fetchedCarts;
};

const store: Resolver = async (parent, _, ctx) => {
	const fetchedStore = await ctx.prisma.product
		.findUnique({
			where: { id: parent.id }
		})
		.store();

	return fetchedStore;
};

const images: Resolver = async (parent, _, ctx) => {
	const fetchedImages = await ctx.prisma.product
		.findUnique({ where: { id: parent.id } })
		.images();

	return fetchedImages;
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
