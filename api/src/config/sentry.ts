import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

import prismaClient from './prisma';

export const initSentry = (app: Express) => {
	Sentry.init({
		dsn: process.env.SENTRY_DSN as string,
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Sentry.Integrations.Express({ app }),
			new Sentry.Integrations.Prisma({ client: prismaClient }),
			new Sentry.Integrations.GraphQL(),
			new Sentry.Integrations.Apollo(),
			nodeProfilingIntegration()
		],
		tracesSampleRate: 1.0,
		profilesSampleRate: 1.0
	});

	// The request handler must be the first middleware on the app
	app.use(Sentry.Handlers.requestHandler());

	// TracingHandler creates a trace for every incoming request
	app.use(Sentry.Handlers.tracingHandler());
};
