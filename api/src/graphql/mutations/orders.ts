import { OrderStatus, PushTokenType } from '@prisma/client';

import { Resolver } from '../../types/resolvers';
import { storeAuthorizedResolver } from '../permissions';
import {
	updateStoreRevenue,
	sendStatusNotification,
	sendNewOrderNotification
} from '../hooks/orders';
import { saveOrderData } from '../../core/data/orders';
import { getCartById } from '../../core/data/carts';

export interface CreateOrderArgs {
	input: {
		cartId: string;
		cardId?: string;
		transactionFee: number;
		serviceFee: number;
	};
}

export const createOrder: Resolver<CreateOrderArgs> = async (
	_,
	{ input: { cartId, cardId, transactionFee, serviceFee } },
	ctx
) => {
	const cart = await getCartById(ctx, cartId);

	// TODO: Validations

	const order = await saveOrderData(ctx, {
		cardId,
		transactionFee,
		serviceFee,
		cart,
		storeId: cart.storeId,
		products: cart.products.map(p => p.product)
	});

	await sendNewOrderNotification(ctx, {
		storeId: cart.storeId,
		orderId: order.id,
		customerName: ctx.user.name,
		amount: order.total
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
