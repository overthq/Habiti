import { Resolver } from '../../types/resolvers';

export const createOrder: Resolver<any> = async (_, { cartId }, ctx) => {
	const cart = await ctx.prisma.cart.findUnique({
		where: { id: cartId },
		include: {
			products: {
				include: {
					product: true
				}
			}
		}
	});

	if (cart.userId === ctx.user.id) {
		const order = await ctx.prisma.order.create({
			data: {
				userId: ctx.user.id,
				storeId: cart.storeId,
				products: {
					createMany: {
						data: cart.products.map(p => ({
							productId: p.productId,
							unitPrice: p.product.unitPrice
						}))
					}
				}
			}
		});
		return order;
	}
};

export default {
	Mutation: {
		createOrder
	}
};
