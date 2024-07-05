import { OrderStatus, PushTokenType } from '@prisma/client';

import { Resolver } from '../../types/resolvers';
import { getPushTokensForStore } from '../../utils/notifications';
import { chargeAuthorization } from '../../utils/paystack';

interface CreateOrderArgs {
	input: {
		cartId: string;
		cardId?: string;
		transactionFee: number;
		serviceFee: number;
	};
}

const createOrder: Resolver<CreateOrderArgs> = async (
	_,
	{ input: { cartId, cardId, transactionFee, serviceFee } },
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

	// This is going to go, seeing that we now require users to pass in the
	// payment method they want to use on a per-order basis.

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
				total,
				transactionFee,
				serviceFee
			}
		}),
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

	const pushTokens = await getPushTokensForStore(order.storeId);

	for (const pushToken of pushTokens) {
		if (pushToken) {
			ctx.services.notifications.queueMessage({
				to: pushToken,
				title: 'Order created',
				body: `${ctx.user.name} created a ${order.total} order`
			});
		}
	}

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
		include: {
			products: { include: { product: true } },
			user: {
				include: { pushTokens: { where: { type: PushTokenType.Shopper } } }
			},
			store: true
		}
	});

	// Workflow:
	// - If the order is fulfilled, update the store's revenue.
	// - If the order is canceled, push a notification.

	if (args.input.status) {
		switch (args.input.status) {
			case OrderStatus.Cancelled:
				if (order.user.pushTokens[0]) {
					ctx.services.notifications.queueMessage({
						to: order.user.pushTokens[0].token,
						title: 'Order cancelled',
						body: `Your order with ${order.store.name} has been cancelled.`
					});
				}
				break;
			case OrderStatus.Completed: {
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

				if (order.user.pushTokens[0]) {
					ctx.services.notifications.queueMessage({
						to: order.user.pushTokens[0].token,
						title: 'Order completed',
						body: `Your order with ${order.store.name} has been marked as complete.`
					});
				}

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
