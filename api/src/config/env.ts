import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	LOOPS_API_KEY: z.string().optional(),
	POSTHOG_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
