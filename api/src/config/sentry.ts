import * as Sentry from '@sentry/bun';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { HTTPException } from 'hono/http-exception';

import { env } from './env';
import { LogicError } from '../core/logic/errors';

/**
 * Sentry is the only trace backend. With `SENTRY_DSN` set, the default
 * `bunServerIntegration` records a span per `Bun.serve` request (it
 * continues `sentry-trace` / `baggage`, not W3C `traceparent`) and
 * `prismaIntegration` records Prisma spans. `httpIntegration` covers
 * outbound HTTP. No OpenTelemetry SDK or OTLP exporter is registered.
 *
 * `pinoIntegration` subscribes to Pino's `pino_asJson` tracing channel
 * (Pino >= 9.10). It is not a Pino transport, so production logging stays
 * on the sync stdout destination. With `SENTRY_DSN` unset this module
 * does not call `Sentry.init`, and nothing subscribes to that channel.
 * `trace` and `debug` are not forwarded. Pino drops anything below
 * `LOG_LEVEL` before the channel runs. `error.levels` stays at the
 * integration default (`[]`), so a Pino error is a Sentry log and not an
 * extra Sentry issue.
 *
 * `middleware/logs.ts` copies the active Sentry span's trace id onto the
 * request log when a span exists. `beforeSend` still drops `LogicError`
 * and HTTP status < 500, matching `errorHandler`.
 */
if (env.SENTRY_DSN) {
	Sentry.init({
		dsn: env.SENTRY_DSN,
		release: env.APP_VERSION,
		environment: env.NODE_ENV ?? 'development',
		tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
		integrations: [
			Sentry.httpIntegration(),
			Sentry.prismaIntegration({
				prismaInstrumentation: new PrismaInstrumentation()
			}),
			Sentry.pinoIntegration({
				log: { levels: ['info', 'warn', 'error', 'fatal'] }
			})
		],
		enableLogs: true,
		beforeSend(event, hint) {
			const err = hint.originalException;

			if (err instanceof HTTPException && err.status < 500) return null;
			if (err instanceof LogicError) return null;

			return event;
		},
		beforeBreadcrumb(breadcrumb) {
			if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
				return null;
			}

			return breadcrumb;
		}
	});
}
