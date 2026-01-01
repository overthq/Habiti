import { z } from 'zod';

export const bulkIdsSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required')
});

export const bulkOrderStatusSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	status: z.enum(['Pending', 'Completed', 'Cancelled', 'PaymentPending'])
});

export const bulkProductStatusSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'At least one ID required'),
	status: z.enum(['Active', 'Draft'])
});
