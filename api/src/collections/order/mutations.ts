import { OrderStatus } from 'prisma';

import { Resolver } from '../../types/resolvers';
import { chargeAuthorization } from '../../utils/paystack';

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

	let total = 0;

	const orderData = cart.products.map(p => {
		total += p.product.unitPrice * p.quantity;

		return {
			productId: p.productId,
			unitPrice: p.product.unitPrice,
			quantity: p.quantity
		};
	});

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
				products: { createMany: { data: orderData } },
				total
			}
		}),
		// ctx.prisma.userPushToken.findUnique({ where: { userId: ctx.user.id } }),
		ctx.prisma.store.update({
			where: { id: cart.storeId },
			data: { unrealizedRevenue: { increment: total } }
		}),
		ctx.prisma.cart.delete({ where: { id: cartId } })
	]);

	await chargeAuthorization({
		email: card.email,
		amount: String(total),
		authorizationCode: card.authorizationCode
	});

	ctx.services.notifications.queueMessage({
		to: '', // pushToken
		title: 'Order created',
		body: `[user.name] created a $x order`
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
	const order = await ctx.prisma.order.update({
		where: { id: args.orderId },
		data: args.input,
		include: { products: { include: { product: true } } }
	});

	// Workflow:
	// - If the order is fulfilled, update the store's revenue.
	// - If the order is canceled, push a notification.

	if (args.input.status) {
		switch (args.input.status) {
			case OrderStatus.Canceled:
				break;
			case OrderStatus.Fulfilled: {
				const total = order.products.reduce((acc, next) => {
					return acc + next.product.unitPrice * next.quantity;
				}, 0);

				await ctx.prisma.store.update({
					where: { id: order.storeId },
					data: {
						realizedRevenue: { increment: total },
						unrealizedRevenue: { decrement: total }
					}
				});

				break;
			}
			default:
				break;
		}
	}

	return order;
};

export default {
	Mutation: {
		createOrder,
		updateOrder
	}
};
