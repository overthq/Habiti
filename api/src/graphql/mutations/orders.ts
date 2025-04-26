import { OrderStatus, PushTokenType } from '@prisma/client';

import { Resolver } from '../../types/resolvers';
import { chargeAuthorization } from '../../utils/paystack';
import { storeAuthorizedResolver } from '../permissions';
import {
	updateStoreRevenue,
	sendStatusNotification,
	sendNewOrderNotification
} from '../hooks/orders';

export interface CreateOrderArgs {
	input: {
		cartId: string;
		cardId: string;
		transactionFee: number;
		serviceFee: number;
	};
}

export const createOrder: Resolver<CreateOrderArgs> = async (
	_,
	{ input: { cartId, cardId, transactionFee, serviceFee } },
	ctx
) => {
	const cart = await ctx.prisma.cart.findUnique({
		where: { id: cartId, userId: ctx.user.id },
		include: {
			user: { include: { cards: { where: { id: cardId } } } },
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

	await sendNewOrderNotification(ctx, {
		storeId: cart.storeId,
		orderId: order.id,
		customerName: ctx.user.name,
		amount: total
	});

	return order;
};

export interface UpdateOrderArgs {
	orderId: string;
	input: {
		status?: OrderStatus;
	};
}

export const updateOrder: Resolver<UpdateOrderArgs> = async (
	_,
	{ orderId, input },
	ctx
) => {
	const order = await ctx.prisma.order.update({
		where: { id: orderId },
		data: input,
		include: {
			products: { include: { product: true } },
			user: {
				include: { pushTokens: { where: { type: PushTokenType.Shopper } } }
			},
			store: true
		}
	});

	return order;
};

export interface UpdateOrderStatusArgs {
	orderId: string;
	status: OrderStatus;
}

export const updateOrderStatus = storeAuthorizedResolver<UpdateOrderStatusArgs>(
	async (_, { orderId, status }, ctx) => {
		const order = await ctx.prisma.order.update({
			where: { id: orderId },
			data: { status },
			include: {
				user: {
					include: { pushTokens: { where: { type: PushTokenType.Shopper } } }
				}
			}
		});

		await updateStoreRevenue(ctx, {
			storeId: order.storeId,
			status,
			total: order.total
		});

		const pushToken = order.user.pushTokens?.[0];

		if (pushToken) {
			sendStatusNotification(ctx, {
				orderId: order.id,
				status,
				customerName: order.user.name,
				pushToken
			});
		}
	}
);
