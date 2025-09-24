import * as Sentry from '@sentry/bun';
import { PrismaInstrumentation } from '@prisma/instrumentation';

import { env } from '../config/env';

if (env.SENTRY_DSN) {
	Sentry.init({
		dsn: env.SENTRY_DSN,
		integrations: [
			Sentry.httpIntegration(),
			Sentry.expressIntegration(),
			Sentry.prismaIntegration({
				prismaInstrumentation: new PrismaInstrumentation()
			}),
			Sentry.graphqlIntegration()
		],
		tracesSampleRate: 1.0
	});
}
