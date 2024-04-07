import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

export const initSentry = (app: Express) => {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Sentry.Integrations.Express({ app }),
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
