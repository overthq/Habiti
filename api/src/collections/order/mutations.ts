import { Resolver } from '../../types/resolvers';
import { chargeAuthorization } from '../../utils/paystack';

// TODO: Pass cardId here (and verify that the user owns the card).
interface CreateOrderArgs {
	cartId: string;
	// cardId: string;
}

export const createOrder: Resolver<CreateOrderArgs> = async (
	_,
	{ cartId },
	ctx
) => {
	const cart = await ctx.prisma.cart.findUnique({
		where: { id: cartId },
		include: {
			user: {
				include: {
					cards: true
				}
			},
			products: {
				include: {
					product: true
				}
			}
		}
	});

	const total = cart.products.reduce((acc, next) => {
		return acc + next.product.unitPrice * next.quantity;
	}, 0);

	await chargeAuthorization({
		email: 'test@test.co',
		amount: String(total * 100),
		authorizationCode: cart.user.cards[0].authorizationCode
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

		// Delete the cart.
		await ctx.prisma.cart.delete({
			where: { id: cartId }
		});

		return order;
	}
};

export default {
	Mutation: {
		createOrder
	}
};
