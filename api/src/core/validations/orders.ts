import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

export const createOrderSchema = z.object({
	cartId: z.string(),
	cardId: z.string(),
	transactionFee: z.number(),
	serviceFee: z.number()
});

export const updateOrderSchema = z.object({
	orderId: z.string(),
	status: z.nativeEnum(OrderStatus)
});
