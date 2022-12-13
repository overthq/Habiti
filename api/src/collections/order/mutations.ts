import { Resolver } from '../../types/resolvers';
import { chargeAuthorization } from '../../utils/paystack';
import { OrderStatus } from 'prisma';

interface CreateOrderArgs {
	input: {
		cartId: string;
		cardId?: string;
	};
}

const createOrder: Resolver<CreateOrderArgs> = async (
	_,
	{ input: { cartId, cardId } },
	ctx
) => {
	const cart = await ctx.prisma.cart.findUnique({
		where: { id: cartId },
		include: {
			user: { include: { cards: true } },
			products: { include: { product: true } }
		}
	});

	const total = cart.products.reduce((acc, next) => {
		return acc + next.product.unitPrice * next.quantity;
	}, 0);

	// TODO:
	// 1. Retrieve (or listen to) the status from the chargeAuthorization call,
	//    so we can update the order status (esp. in the case that the payment fails).
	// 2. It probably makes more sense to always pass the cardId.

	if (cart.userId !== ctx.user.id) {
		throw new Error('You are not authorized to access this cart.');
	}

	const card = cardId
		? cart.user.cards.find(c => c.id === cardId)
		: cart.user.cards[0];

	if (!card) {
		throw new Error('Please add a card to authorize this transaction');
	}

	const [order] = await ctx.prisma.$transaction([
		ctx.prisma.order.create({
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
		}),
		ctx.prisma.cart.delete({ where: { id: cartId } })
	]);

	await chargeAuthorization({
		email: card.email,
		amount: String(total),
		authorizationCode: card.authorizationCode
	});

	return order;
};

interface UpdateOrderArgs {
	orderId: string;
	input: {
		status?: OrderStatus;
	};
}

const updateOrder: Resolver<UpdateOrderArgs> = async (_, args, ctx) => {
	await ctx.prisma.order.update({
		where: { id: args.orderId },
		data: args.input
	});
};

export default {
	Mutation: {
		createOrder,
		updateOrder
	}
};
