import pino, { type Logger as PinoLogger } from 'pino';

import { env } from '../config/env';

/**
 * Centralised pino logger. Prefer `c.var.logger` (set by `logsMiddleware`)
 * over `rootLogger` whenever a request context is in scope — the per-request
 * child logger carries `requestId` / `traceId` / `userId` / `storeId`.
 *
 * Pino's call shape is `logger.info(fields, msg)` — object first, message
 * second. Easy to typo (it's the inverse of `console.log`), so most callers
 * stick to the explicit `({ ...fields }, 'event_name')` form.
 */
export const rootLogger: PinoLogger = pino({
	level: env.LOG_LEVEL,
	base: {
		service: env.OTEL_SERVICE_NAME,
		version: env.APP_VERSION,
		environment: env.NODE_ENV ?? 'development'
	},
	redact: {
		paths: [
			'req.headers.authorization',
			'req.headers.cookie',
			'req.headers["x-paystack-signature"]',
			'headers.authorization',
			'headers.cookie',
			'*.password',
			'*.passwordHash',
			'*.refreshToken',
			'*.accessToken',
			'*.code',
			'*.authorizationCode'
		],
		censor: '[REDACTED]'
	},
	serializers: {
		// Axios errors carry the Paystack bearer token in `config.headers`.
		err: err => {
			const { config, request, response, ...rest } =
				pino.stdSerializers.err(err);
			return rest;
		}
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	formatters: {
		level: label => ({ level: label })
	},
	...(env.NODE_ENV !== 'production' && {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				singleLine: true,
				translateTime: 'HH:MM:ss.l'
			}
		}
	})
});

export type Logger = PinoLogger;
