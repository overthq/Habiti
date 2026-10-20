import * as Sentry from '@sentry/bun';
import { HTTPException } from 'hono/http-exception';

import { env } from './env';
import { LogicError } from '../core/logic/errors';

if (env.SENTRY_DSN) {
	Sentry.init({
		dsn: env.SENTRY_DSN,
		release: env.APP_VERSION,
		environment: env.NODE_ENV ?? 'development',
		integrations: [
			Sentry.openTelemetryIntegration(),
			Sentry.pinoIntegration({
				log: { levels: ['info', 'warn', 'error', 'fatal'] }
			})
		],
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
