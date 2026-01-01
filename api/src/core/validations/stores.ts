import { z } from 'zod';

export const adminCreateStoreSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional()
});
