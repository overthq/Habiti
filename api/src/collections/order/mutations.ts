import { Resolver } from '../../types/resolvers';
import { chargeAuthorization } from '../../utils/paystack';
import { OrderStatus } from 'prisma';

interface CreateOrderArgs {
	cartId: string;
	cardId?: string;
}

const createOrder: Resolver<CreateOrderArgs> = async (
	_,
	{ cartId, cardId },
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

	// TODO:
	// 1. Move all this logic into a `resolveCard` function.
	//    It might be useful in other cases.
	// 2. Move chargeAuthorization to after the order object has been created?
	// 3. Retrieve (or listen to) the status from the chargeAuthorization call,
	//    so we can update the order status (esp. in the case that the payment fails).

	if (!cart.user.cards[0]) {
		throw new Error('You do not have a card linked to this account!');
	}

	let card = cart.user.cards[0];

	if (cardId) {
		card = await ctx.prisma.card.findUnique({ where: { id: cardId } });
	}

	await chargeAuthorization({
		email: card.email,
		amount: String(total),
		authorizationCode: card.authorizationCode
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
							unitPrice: p.product.unitPrice,
							quantity: p.quantity
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

interface UpdateOrderArgs {
	orderId: string;
	input: {
		status: OrderStatus;
	};
}

export const updateOrder: Resolver<UpdateOrderArgs> = async (_, args, ctx) => {
	await ctx.prisma.order.update({
		where: {
			id: args.orderId
		},
		data: args.input
	});
};

export default {
	Mutation: {
		createOrder
	}
};
