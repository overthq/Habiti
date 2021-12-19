import { Resolver } from '../../types/resolvers';

interface CartArgs {
	id: string;
}

const cart: Resolver<CartArgs> = async (_, { id }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { id }
	});

	return fetchedCart;
};

const userCarts: Resolver = async (_, __, ctx) => {
	const carts = await ctx.prisma.cart.findMany({
		where: { userId: ctx.user.id }
	});

	return carts;
};

interface UserCartArgs {
	storeId: string;
}

const userCart: Resolver<UserCartArgs> = async (_, { storeId }, ctx) => {
	const fetchedCart = await ctx.prisma.cart.findUnique({
		where: { userId_storeId: { userId: ctx.user.id, storeId } }
	});

	return fetchedCart;
};

const user: Resolver = async (parent, _, ctx) => {
	const fetchedUser = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.user();

	return fetchedUser;
};

const products: Resolver = async (parent, _, ctx) => {
	const fetchedProducts = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.products();

	return fetchedProducts;
};

const store: Resolver = async (parent, _, ctx) => {
	const fetchedStore = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.store();

	return fetchedStore;
};

interface ProductArgs {
	id: string;
}

// Extremely hacky and bad
const product: Resolver<ProductArgs> = async (parent, { id }, ctx) => {
	const fetchedProducts = await ctx.prisma.cart
		.findUnique({ where: { id: parent.id } })
		.products({
			where: {
				productId: id
			}
		});

	const fetchedProduct = fetchedProducts[0];

	return fetchedProduct;
};

// TODO: Move these to separate collections query file.

const cartProductProduct: Resolver = async (parent, _, ctx) => {
	const fetchedCartProductProduct = await ctx.prisma.cartProduct
		.findUnique({
			where: {
				cartId_productId: {
					cartId: parent.cartId,
					productId: parent.productId
				}
			}
		})
		.product();

	return fetchedCartProductProduct;
};

const cartProductCart: Resolver = async (parent, _, ctx) => {
	const fetchedCartProductCart = await ctx.prisma.cartProduct
		.findUnique({
			where: {
				cartId_productId: {
					cartId: parent.cartId,
					productId: parent.productId
				}
			}
		})
		.cart();

	return fetchedCartProductCart;
};

export default {
	Query: {
		cart,
		userCarts,
		userCart
	},
	Cart: {
		user,
		products,
		product,
		store
	},
	CartProduct: {
		product: cartProductProduct,
		cart: cartProductCart
	}
};
