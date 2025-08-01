import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	PORT: z.string().default('4000'),
	NODE_ENV: z.string().optional(),
	APP_VERSION: z.string().default('1.0.0'),
	JWT_SECRET: z.string(),
	LOOPS_API_KEY: z.string().optional(),
	POSTHOG_API_KEY: z.string().optional(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
	SENTRY_DSN: z.string().optional(),
	APPLE_CLIENT_ID: z.string().optional(),
	APPLE_CLIENT_SECRET: z.string().optional(),
	APPLE_REDIRECT_URI: z.string().optional(),
	PAYSTACK_SECRET_KEY: z.string(),
	REDIS_URL: z.string().optional(),
	REDIS_TLS_URL: z.string().optional()
});

export const env = envSchema.parse(process.env);
