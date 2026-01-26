import { z } from 'zod';

export const bulkIdsSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required')
});

export const bulkUserUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('suspended'),
	value: z.boolean()
});

export const bulkOrderUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('status'),
	value: z.enum(['Pending', 'Completed', 'Cancelled', 'PaymentPending'])
});

export const bulkProductUpdateSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	field: z.literal('status'),
	value: z.enum(['Active', 'Draft'])
});
