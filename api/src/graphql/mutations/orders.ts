import { OrderStatus } from '@prisma/client';

import { Resolver } from '../../types/resolvers';
import { storeAuthorizedResolver } from '../permissions';
import {
	createOrder as createOrderLogic,
	updateOrderStatus as updateOrderStatusLogic
} from '../../core/logic/orders';
import { executeOrderSideEffects } from '../../core/logic/orders/sideEffects';

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
	const result = await createOrderLogic(input, ctx);

	executeOrderSideEffects(ctx, result.sideEffects).catch(error => {
		console.error('Order side effects execution failed:', error);
	});

	return result.order;
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

	const result = await updateOrderStatusLogic(
		{ orderId, status: input.status },
		ctx
	);

	executeOrderSideEffects(ctx, result.sideEffects).catch(error => {
		console.error('Order side effects execution failed:', error);
	});

	return result.order;
};

export interface UpdateOrderStatusArgs {
	orderId: string;
	status: OrderStatus;
}

export const updateOrderStatus = storeAuthorizedResolver<UpdateOrderStatusArgs>(
	async (_, { orderId, status }, ctx) => {
		const result = await updateOrderStatusLogic({ orderId, status }, ctx);

		executeOrderSideEffects(ctx, result.sideEffects).catch(error => {
			console.error('Order side effects execution failed:', error);
		});

		return result.order;
	}
);
