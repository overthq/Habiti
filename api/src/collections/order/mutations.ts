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
	// Get all required data in a single query
	const cart = await ctx.prisma.cart.findUnique({
		where: { id: cartId, userId: ctx.user.id },
		include: {
			user: {
				include: {
					cards: cardId ? { where: { id: cardId } } : true
				}
			},
			products: { include: { product: true } },
			store: true
		}
	});

	if (!cart) {
		throw new Error('Cart not found');
	}

	const card = cart.user.cards[0];

	if (!card) {
		throw new Error('Please add a card to authorize this transaction');
	}

	let total = 0;
	const orderData = cart.products.map(p => {
		total += p.product.unitPrice * p.quantity;
		return {
			productId: p.productId,
			unitPrice: p.product.unitPrice,
			quantity: p.quantity
		};
	});

	// Execute all database operations and payment in a single transaction
	const [order] = await ctx.prisma.$transaction(async prisma => {
		// Charge the card first - if this fails, no DB changes will be made
		await chargeAuthorization({
			email: card.email,
			amount: String(total),
			authorizationCode: card.authorizationCode
		});

		const [, order] = await Promise.all([
			prisma.store.update({
				where: { id: cart.storeId },
				data: {
					orderCount: { increment: 1 },
					unrealizedRevenue: { increment: total }
				}
			}),
			prisma.order.create({
				data: {
					userId: ctx.user.id,
					storeId: cart.storeId,
					serialNumber: cart.store.orderCount + 1,
					products: { createMany: { data: orderData } },
					total,
					transactionFee,
					serviceFee
				}
			}),
			prisma.cart.delete({ where: { id: cartId } })
		]);

		return [order];
	});

	// Queue notifications outside transaction since they're not critical
	const pushTokens = await getPushTokensForStore(order.storeId);

	ctx.services.notifications.queueNotification({
		type: 'NEW_ORDER',
		data: {
			customerName: ctx.user.name,
			amount: order.total,
			orderId: order.id
		},
		recipientTokens: pushTokens
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
					ctx.services.notifications.queueNotification({
						type: 'ORDER_CANCELLED',
						data: {
							customerName: order.user.name,
							orderId: order.id
						},
						recipientTokens: [order.user.pushTokens[0].token]
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
					ctx.services.notifications.queueNotification({
						type: 'ORDER_COMPLETED',
						data: {
							customerName: order.user.name,
							orderId: order.id
						},
						recipientTokens: [order.user.pushTokens[0].token]
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
