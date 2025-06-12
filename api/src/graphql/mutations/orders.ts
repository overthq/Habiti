import { OrderStatus } from '@prisma/client';

import { Resolver } from '../../types/resolvers';
import { storeAuthorizedResolver } from '../permissions';
import { createOrder as createOrderLogic } from '../../core/logic/orders/createOrder';
import { updateOrderStatus as updateOrderStatusLogic } from '../../core/logic/orders/updateOrder';
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
	console.log('input', input);
	if (!input.status) {
		throw new Error('Status is required for order updates');
	}

	console.log('here 1');

	const result = await updateOrderStatusLogic(
		{ orderId, status: input.status },
		ctx
	);

	console.log('here 2', result);

	executeOrderSideEffects(ctx, result.sideEffects).catch(error => {
		console.error('Order side effects execution failed:', error);
	});

	console.log('here 3');

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
