import { OrderStatus } from '../../generated/prisma/client';

import { Resolver } from '../../types/resolvers';
import { storeAuthorizedResolver } from '../permissions';
import * as OrderLogic from '../../core/logic/orders';

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
	{ input },
	ctx
) => {
	const { order } = await OrderLogic.createOrder(ctx, input);

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
	if (!input.status) {
		throw new Error('Status is required for order updates');
	}

	return OrderLogic.updateOrderStatus(ctx, {
		orderId,
		status: input.status
	});
};

export interface UpdateOrderStatusArgs {
	orderId: string;
	status: OrderStatus;
}

export const updateOrderStatus = storeAuthorizedResolver<UpdateOrderStatusArgs>(
	(_, { orderId, status }, ctx) => {
		return OrderLogic.updateOrderStatus(ctx, { orderId, status });
	}
);
