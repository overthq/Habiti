import { Resolver } from '../../types/resolvers';

const product: Resolver = async (parent, _, ctx) => {
	const fetchedProduct = await ctx.prisma.cartProduct
		.findUnique({
			where: {
				cartId_productId: {
					cartId: parent.cartId,
					productId: parent.productId
				}
			}
		})
		.product();

	return fetchedProduct;
};

const cart: Resolver = async (parent, _, ctx) => {
	const fetchedCart = await ctx.prisma.cartProduct
		.findUnique({
			where: {
				cartId_productId: {
					cartId: parent.cartId,
					productId: parent.productId
				}
			}
		})
		.cart();

	return fetchedCart;
};

export default {
	CartProduct: {
		product,
		cart
	}
};
