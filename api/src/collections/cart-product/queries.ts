import { Resolver } from '../../types/resolvers';

const id: Resolver = async parent => {
	return `${parent.cartId}-${parent.productId}`;
};

const product: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.cartProduct
		.findUnique({
			where: {
				cartId_productId: { cartId: parent.cartId, productId: parent.productId }
			}
		})
		.product();
};

const cart: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.cartProduct
		.findUnique({
			where: {
				cartId_productId: { cartId: parent.cartId, productId: parent.productId }
			}
		})
		.cart();
};

export default {
	CartProduct: {
		id,
		product,
		cart
	}
};
