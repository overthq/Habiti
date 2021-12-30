import { Resolver } from '../../types/resolvers';

const order: Resolver = async (parent, _, ctx) => {
	const fetchedOrder = await ctx.prisma.orderProduct
		.findUnique({
			where: {
				orderId_productId: {
					orderId: parent.orderId,
					productId: parent.productId
				}
			}
		})
		.order();
	return fetchedOrder;
};

const product: Resolver = async (parent, _, ctx) => {
	const fetchedProduct = await ctx.prisma.orderProduct
		.findUnique({
			where: {
				orderId_productId: {
					orderId: parent.orderId,
					productId: parent.productId
				}
			}
		})
		.product();

	return fetchedProduct;
};

export default {
	OrderProduct: {
		order,
		product
	}
};
