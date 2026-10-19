import * as Sentry from '@sentry/bun';
import { HTTPException } from 'hono/http-exception';

import { env } from './env';
import { LogicError } from '../core/logic/errors';
import { startTelemetry } from './telemetry';

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
