import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
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
			Sentry.graphqlIntegration(),
			nodeProfilingIntegration()
		],
		tracesSampleRate: 1.0,
		profilesSampleRate: 1.0
	});
}
