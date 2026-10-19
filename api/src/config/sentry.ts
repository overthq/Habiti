import * as Sentry from '@sentry/bun';
import { HTTPException } from 'hono/http-exception';

import { env } from './env';
import { LogicError } from '../core/logic/errors';
import { startTelemetry } from './telemetry';

/**
 * Boots the tracer provider, then Sentry.
 *
 * Importing this module is the process entry for telemetry. `startTelemetry`
 * registers the OpenTelemetry provider before `Sentry.init`.
 *
 * `enableOpenTelemetrySetup: false` is the flag `@sentry/bun` 11 actually
 * has (`skipOpenTelemetrySetup` is gone). Left false, Sentry does not
 * register a tracer provider. `openTelemetryIntegration` attaches Sentry
 * errors, logs, metrics, and check-ins to the active OpenTelemetry span.
 * `tracesSampleRate` and `tracesSampler` stay unset; sampling is the
 * provider's.
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
 * `prismaIntegration` stays so Prisma's tracing helper is installed. On
 * SDK 11 that helper emits Sentry spans, and with tracing sample rates
 * unset those spans are not recorded and are not exported on our provider.
 *
 * `beforeSend` still drops `LogicError` and HTTP status < 500, matching
 * `errorHandler`.
 */
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

export const initSentry = (): boolean => {
	if (!env.SENTRY_DSN) return false;

	// SDK 11 captures logs whenever `pinoIntegration` is installed; `enableLogs`
	// is no longer on `BunOptions`. It is still set so `getOptions().enableLogs`
	// stays true, which is what the existing log-forwarding check reads.
	const sentryOptions: Sentry.BunOptions & { enableLogs: true } = {
		dsn: env.SENTRY_DSN,
		release: env.APP_VERSION,
		environment: env.NODE_ENV ?? 'development',
		enableLogs: true,
		enableOpenTelemetrySetup: false,
		beforeSend,
		beforeBreadcrumb,
		integrations: [
			Sentry.openTelemetryIntegration(),
			Sentry.prismaIntegration(),
			pinoLogs()
		]
	};

	Sentry.init(sentryOptions);

	return true;
};

startTelemetry(initSentry);
