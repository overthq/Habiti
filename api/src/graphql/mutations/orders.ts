import { OrderStatus } from '@prisma/client';

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
	const order = await OrderLogic.createOrder(input, ctx);

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

	const order = await OrderLogic.updateOrderStatus(
		{ orderId, status: input.status },
		ctx
	);

	return order;
};

export interface UpdateOrderStatusArgs {
	orderId: string;
	status: OrderStatus;
}

export const updateOrderStatus = storeAuthorizedResolver<UpdateOrderStatusArgs>(
	async (_, { orderId, status }, ctx) => {
		const order = await OrderLogic.updateOrderStatus({ orderId, status }, ctx);

		return order;
	}
);
