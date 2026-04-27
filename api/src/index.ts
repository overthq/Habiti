import './config/sentry';

import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';
import { timing } from 'hono/timing';
import * as Sentry from '@sentry/bun';

import { errorHandler } from './middleware/errorHandler';
import { contextMiddleware, services } from './middleware/context';
import logsMiddleware from './middleware/logs';
import {
	inflightMiddleware,
	whenIdle,
	inFlightCount
} from './middleware/inflight';
import routes from './routes';

import { rootLogger } from './services/logger';
import { corsConfig } from './utils/cors';
import { env } from './config/env';
import prismaClient from './config/prisma';
import redisClient from './config/redis';
import './config/cloudinary';

const app = new Hono();

app.use('*', corsConfig);

app.use(
	'*',
	secureHeaders({
		strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
		xFrameOptions: 'DENY',
		xContentTypeOptions: 'nosniff',
		referrerPolicy: 'no-referrer',
		crossOriginResourcePolicy: 'same-site'
	})
);

app.use('*', async (c, next) => {
	if (c.req.path.startsWith('/uploads')) return next();
	return bodyLimit({
		maxSize: 256 * 1024,
		onError: ctx => ctx.json({ message: 'Payload too large' }, 413)
	})(c, next);
});

app.use('*', timing());
app.use('*', logsMiddleware);
app.use('*', contextMiddleware);
app.use('*', inflightMiddleware);

app.route('/', routes);

app.onError(errorHandler);

// ─── Process-level safety nets ──────────────────────────────────────────────
//
// Once shutdown begins (or `uncaughtException` has fired), further async
// errors should be best-effort logged but must not re-trigger any handler
// that could exit the process or kick off another shutdown. `isExiting`
// gates re-entry across all three callbacks.

let isExiting = false;

process.on('unhandledRejection', (reason, promise) => {
	if (isExiting) {
		// Best-effort log only — Sentry may already be closed.
		try {
			rootLogger.error({ err: reason }, 'unhandled_rejection.during_exit');
		} catch {
			// Logger transport may have closed too. Swallow.
		}
		return;
	}

	rootLogger.error({ err: reason }, 'unhandled_rejection');

	Sentry.captureException(reason, scope => {
		scope.setExtra('promise', String(promise));
		return scope;
	});
});

process.on('uncaughtException', err => {
	if (isExiting) {
		try {
			rootLogger.fatal({ err }, 'uncaught_exception.during_exit');
		} catch {
			// Same — last-ditch.
		}
		return;
	}
	isExiting = true;
	rootLogger.fatal({ err }, 'uncaught_exception');
	Sentry.captureException(err);
	Sentry.close(2_000)
		.catch(() => {})
		.finally(() => process.exit(1));
});

// ─── Graceful shutdown ──────────────────────────────────────────────────────
//
// On SIGTERM / SIGINT:
//   1. Stop accepting new connections (`server.stop(false)` — synchronous;
//      doesn't wait, only marks the listener closed).
//   2. Wait for in-flight requests to drain via `whenIdle()`. Capped by
//      `DRAIN_TIMEOUT_MS` so a slow request can't pin us forever — after
//      that we proceed regardless.
//   3. Drain background workers (analytics + notifications queue).
//   4. Close persistent connections.
//   5. Exit cleanly.
//
// Wrapped so a second signal mid-shutdown is a no-op.

const SHUTDOWN_TIMEOUT_MS = 25_000;
const DRAIN_TIMEOUT_MS = 15_000;
let shuttingDown = false;
let server: ReturnType<typeof Bun.serve> | undefined;

const withTimeout = async <T>(
	p: Promise<T>,
	ms: number,
	label: string
): Promise<T | undefined> => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<undefined>(resolve => {
		timer = setTimeout(() => {
			rootLogger.warn({ label, ms }, 'shutdown.timeout');
			resolve(undefined);
		}, ms);
	});
	try {
		return await Promise.race([p, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
};

const shutdown = async (signal: string) => {
	if (shuttingDown) return;
	shuttingDown = true;
	isExiting = true;
	rootLogger.info({ signal, inflight: inFlightCount() }, 'shutdown.start');

	// Hard cap so a stuck dependency can't block the orchestrator forever.
	const force = setTimeout(() => {
		rootLogger.error({ signal }, 'shutdown.forced');
		process.exit(1);
	}, SHUTDOWN_TIMEOUT_MS);
	force.unref();

	try {
		// 1. Stop accepting new connections.
		try {
			server?.stop?.(false);
		} catch (err) {
			rootLogger.warn({ err }, 'shutdown.server_stop_failed');
		}

		// 2. Wait for in-flight handlers to finish — capped so a slow handler
		//    doesn't burn the whole shutdown budget.
		await withTimeout(whenIdle(), DRAIN_TIMEOUT_MS, 'inflight_drain');
		rootLogger.info({ inflight: inFlightCount() }, 'shutdown.inflight_drained');

		// 3. Drain workers in parallel — a hung dependency in one branch
		//    shouldn't block the others.
		await Promise.allSettled([
			(async () => {
				try {
					await services.notifications.flush();
				} catch (err) {
					rootLogger.warn({ err }, 'shutdown.notifications_failed');
				}
			})(),
			(async () => {
				try {
					await services.analytics.flush();
					await services.analytics.shutdown();
				} catch (err) {
					rootLogger.warn({ err }, 'shutdown.analytics_failed');
				}
			})()
		]);

		// 4. Close persistent connections.
		await Promise.allSettled([
			(async () => {
				try {
					await prismaClient.$disconnect();
				} catch (err) {
					rootLogger.warn({ err }, 'shutdown.prisma_failed');
				}
			})(),
			(async () => {
				try {
					redisClient.close();
				} catch (err) {
					rootLogger.warn({ err }, 'shutdown.redis_failed');
				}
			})(),
			(async () => {
				try {
					await Sentry.close(2_000);
				} catch (err) {
					rootLogger.warn({ err }, 'shutdown.sentry_failed');
				}
			})()
		]);

		rootLogger.info('shutdown.complete');
	} finally {
		clearTimeout(force);
		process.exit(0);
	}
};

process.on('SIGTERM', () => {
	void shutdown('SIGTERM');
});
process.on('SIGINT', () => {
	void shutdown('SIGINT');
});

// ─── Boot ──────────────────────────────────────────────────────────────────

const main = async () => {
	await redisClient.connect();

	server = Bun.serve({
		port: Number(env.PORT),
		fetch: app.fetch
	});

	rootLogger.info({ port: env.PORT }, 'server_started');
};

main();
