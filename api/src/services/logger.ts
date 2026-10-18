import pino, { type Logger as PinoLogger } from 'pino';

import { env } from '../config/env';

/**
 * Centralised pino logger. Prefer `c.var.logger` (set by `logsMiddleware`)
 * over `rootLogger` whenever a request context is in scope.
 *
 * `logsMiddleware` binds `requestId`, `traceId`, `spanId`, `method`, and
 * `path` before auth runs. The auth middleware then replaces that logger
 * with one child that also binds `userId` and `storeId` when each is known.
 * `userId` is the access-token id. `storeId` is the token's store claim, or
 * the `x-market-store-id` header on an optional-auth request with no token.
 * Public routes, webhooks, and failed auth keep the pre-auth child.
 * `request_finished` still records whichever of the two the request ended
 * with.
 *
 * Pino's call shape is `logger.info(fields, msg)` — object first, message
 * second. Easy to typo (it's the inverse of `console.log`), so most callers
 * stick to the explicit `({ ...fields }, 'event_name')` form.
 */

/**
 * `*` matches one path segment, and an array index counts as a segment. It
 * is not a recursive wildcard. Depths 1–4 cover the Paystack bodies we log,
 * including `responseData.data.details.account_number` and
 * `responseData.data[0].account_number`. A fifth segment is not redacted
 * here. `redactSensitive` walks the whole value before the log call. Sentry
 * `extra` never goes through this list.
 */
const nestedRedactPaths = (key: string, depth: number) =>
	Array.from({ length: depth }, (_, index) => `${'*.'.repeat(index + 1)}${key}`);

export const REDACT_PATHS = [
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
	...nestedRedactPaths('authorizationCode', 4),
	...nestedRedactPaths('authorization_code', 4),
	...nestedRedactPaths('account_number', 4),
	...nestedRedactPaths('accountNumber', 4),
	...nestedRedactPaths('otp', 4)
];

export const rootLogger: PinoLogger = pino({
	level: env.LOG_LEVEL,
	base: {
		service: env.OTEL_SERVICE_NAME,
		version: env.APP_VERSION,
		environment: env.NODE_ENV ?? 'development'
	},
	redact: {
		paths: REDACT_PATHS,
		censor: '[REDACTED]'
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
