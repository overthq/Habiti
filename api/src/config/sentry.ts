import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

export const initSentry = (app: Express) => {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		integrations: [
			// enable HTTP calls tracing
			new Sentry.Integrations.Http({ tracing: true }),
			// enable Express.js middleware tracing
			new Sentry.Integrations.Express({ app }),
			nodeProfilingIntegration()
		],
		// Performance Monitoring
		tracesSampleRate: 1.0, //  Capture 100% of the transactions
		// Set sampling rate for profiling - this is relative to tracesSampleRate
		profilesSampleRate: 1.0
	});

	// The request handler must be the first middleware on the app
	app.use(Sentry.Handlers.requestHandler());

	// TracingHandler creates a trace for every incoming request
	app.use(Sentry.Handlers.tracingHandler());
};
