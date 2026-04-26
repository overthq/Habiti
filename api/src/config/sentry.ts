import * as Sentry from '@sentry/bun';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { HTTPException } from 'hono/http-exception';

import { env } from './env';
import { LogicError } from '../core/logic/errors';

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
