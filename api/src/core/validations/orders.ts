import { z } from 'zod';

export const createOrderSchema = z.object({
	cartId: z.string(),
	cardId: z.string(),
	transactionFee: z.number(),
	serviceFee: z.number()
});
