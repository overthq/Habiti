import { z } from 'zod';

const envSchema = z.object({
	PORT: z.string().default('4000'),
	NODE_ENV: z.string().optional(),
	APP_VERSION: z.string().default('1.0.0'),
	JWT_SECRET: z.string(),
	LOOPS_API_KEY: z.string().optional(),
	POSTHOG_API_KEY: z.string().optional(),
	CLOUDINARY_CLOUD_NAME: z.string().optional(),
	CLOUDINARY_API_KEY: z.string().optional(),
	CLOUDINARY_API_SECRET: z.string().optional(),
	PUBLIC_URL: z.string().optional(),
	SENTRY_DSN: z.string().optional(),
	APPLE_CLIENT_ID: z.string().optional(),
	APPLE_BUNDLE_IDS: z
		.string()
		.default(
			[
				'app.habiti.app',
				'app.habiti.app.dev',
				'app.habiti.app.preview',
				'app.habiti.dashboard',
				'app.habiti.dashboard.dev',
				'app.habiti.dashboard.preview'
			].join(',')
		),
	PAYSTACK_SECRET_KEY: z.string(),
	PAYSTACK_BASE_URL: z.string().default('https://api.paystack.co'),
	REDIS_URL: z.string().optional(),
	REDIS_TLS_URL: z.string().optional(),
	DATABASE_URL: z.string().optional(),
	TEST_ACCOUNT_EMAIL: z.string().optional(),
	TEST_ACCOUNT_OTP: z.string().optional(),
	RATE_LIMIT_DISABLED: z
		.enum(['true', 'false'])
		.default('false')
		.transform(v => v === 'true'),
	PUSH_OUTBOX_KEY: z.string().optional(),
	LOG_LEVEL: z
		.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
		.default('info'),
	SLOW_QUERY_THRESHOLD_MS: z
		.string()
		.default('250')
		.transform(v => parseInt(v, 10)),
	INTERNAL_TOKEN: z.string().optional(),
	OTEL_SERVICE_NAME: z.string().default('habiti-api'),
	OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional()
});

export const env = envSchema.parse(Bun.env);

if (env.NODE_ENV === 'production') {
	if (env.RATE_LIMIT_DISABLED || env.PUSH_OUTBOX_KEY) {
		throw new Error(
			'RATE_LIMIT_DISABLED and PUSH_OUTBOX_KEY cannot be used in production'
		);
	}

	if (!env.CLOUDINARY_CLOUD_NAME) {
		throw new Error('Cloudinary must be configured in production');
	}
}
