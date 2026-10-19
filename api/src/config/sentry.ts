import * as Sentry from '@sentry/bun';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { HTTPException } from 'hono/http-exception';

import { env } from './env';
import { LogicError } from '../core/logic/errors';

/**
 * Sentry setup for the two modes `config/telemetry.ts` selects.
 *
 * `traces` is the default when `SENTRY_DSN` is set and no OTLP endpoint is.
 * `@sentry/bun` registers its own OpenTelemetry provider (`bunServerIntegration`
 * spans per `Bun.serve` request, continuing `sentry-trace` / `baggage` rather
 * than W3C `traceparent`, plus Prisma and outbound HTTP spans).
 *
 * `errors` is used when an OTLP endpoint is also set. `skipOpenTelemetrySetup`
 * is a supported `BunOptions` flag (`@sentry/node-core`
 * `OpenTelemetryServerRuntimeOptions`): `Sentry.init` then does not call
 * `initOpenTelemetry`, so it does not call `trace.setGlobalTracerProvider`.
 * `tracesSampleRate` is omitted, which leaves `hasSpansEnabled` false, so the
 * default Bun and HTTP integrations do not emit recording spans.
 * `SentrySpanProcessor` is intentionally not installed — traces have one
 * exporter. Errors and Pino logs still go to Sentry.
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
 * `beforeSend` still drops `LogicError` and HTTP status < 500, matching
 * `errorHandler`.
 */
export type SentryInitMode = 'traces' | 'errors';

const beforeSend: NonNullable<Sentry.BunOptions['beforeSend']> = (
	event,
	hint
) => {
	const err = hint.originalException;

	if (err instanceof HTTPException && err.status < 500) return null;
	if (err instanceof LogicError) return null;

	return event;
};

const beforeBreadcrumb: NonNullable<Sentry.BunOptions['beforeBreadcrumb']> = (
	breadcrumb
) => {
	if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
		return null;
	}

	return breadcrumb;
};

const pinoLogs = () =>
	Sentry.pinoIntegration({
		log: { levels: ['info', 'warn', 'error', 'fatal'] }
	});

export const initSentry = (mode: SentryInitMode): boolean => {
	if (!env.SENTRY_DSN) return false;

	const shared = {
		dsn: env.SENTRY_DSN,
		release: env.APP_VERSION,
		environment: env.NODE_ENV ?? 'development',
		enableLogs: true,
		beforeSend,
		beforeBreadcrumb
	};

	if (mode === 'traces') {
		Sentry.init({
			...shared,
			tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
			integrations: [
				Sentry.httpIntegration(),
				Sentry.prismaIntegration({
					prismaInstrumentation: new PrismaInstrumentation()
				}),
				pinoLogs()
			]
		});

		return true;
	}

	Sentry.init({
		...shared,
		skipOpenTelemetrySetup: true,
		integrations: [pinoLogs()]
	});

	return true;
};
