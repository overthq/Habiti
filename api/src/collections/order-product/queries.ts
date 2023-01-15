import { Resolver } from '../../types/resolvers';

const id: Resolver = async parent => {
	return `${parent.orderId}-${parent.productId}`;
};

const order: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.orderProduct
		.findUnique({
			where: {
				orderId_productId: {
					orderId: parent.orderId,
					productId: parent.productId
				}
			}
		})
		.order();
};

const product: Resolver = async (parent, _, ctx) => {
	return ctx.prisma.orderProduct
		.findUnique({
			where: {
				orderId_productId: {
					orderId: parent.orderId,
					productId: parent.productId
				}
			}
		})
		.product();
};

export default {
	OrderProduct: {
		id,
		order,
		product
	}
};
