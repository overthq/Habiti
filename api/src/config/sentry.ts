import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { Express } from 'express';

export const initSentry = (app: Express) => {
	Sentry.init({
		dsn: process.env.SENTRY_DSN as string,
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

	Sentry.setupExpressErrorHandler(app);
};
