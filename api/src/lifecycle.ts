import * as Sentry from '@sentry/bun';

import type { Logger } from './services/logger';

/**
 * Process lifecycle: graceful shutdown + the process-level safety nets.
 *
 * Shutdown is a list of hooks, each tagged with a stage. Stages run in
 * order; hooks within a stage run in parallel, since a hung dependency in
 * one branch shouldn't block the others. Every hook is individually
 * timed out and its failure logged — one bad hook can't strand the rest.
 *
 *   accept       stop taking new connections. `Bun.serve().stop(false)`
 *                returns synchronously and only marks the listener closed;
 *                it does NOT wait for active handlers.
 *   drain        wait for in-flight requests to finish. This is the step
 *                that makes the above wait real.
 *   workers      flush background work (notifications queue, analytics).
 *   connections  close persistent connections (Prisma, Redis, Sentry).
 *
 * `exit` and `captureException` are injected so the whole sequence can be
 * driven in a test without taking the process down with it.
 */

export type ShutdownStage = 'accept' | 'drain' | 'workers' | 'connections';

const STAGE_ORDER: readonly ShutdownStage[] = [
	'accept',
	'drain',
	'workers',
	'connections'
];

export type ShutdownHook = {
	name: string;
	stage: ShutdownStage;
	/** Overrides `hookTimeoutMs` for this hook. */
	timeoutMs?: number;
	run: () => unknown | Promise<unknown>;
};

export type LifecycleOptions = {
	logger: Logger;
	/** Hard cap on the entire sequence. Exceeded ⇒ exit(1). */
	forceExitAfterMs?: number;
	/** Default per-hook cap, so one slow hook can't eat the whole budget. */
	hookTimeoutMs?: number;
	exit?: (code: number) => void;
	captureException?: (err: unknown, context?: Record<string, unknown>) => void;
	/** Flush the error reporter before a fatal exit. */
	flushErrors?: () => Promise<unknown>;
};

const DEFAULT_FORCE_EXIT_MS = 25_000;
const DEFAULT_HOOK_TIMEOUT_MS = 15_000;

export const createLifecycle = ({
	logger,
	forceExitAfterMs = DEFAULT_FORCE_EXIT_MS,
	hookTimeoutMs = DEFAULT_HOOK_TIMEOUT_MS,
	exit = code => process.exit(code),
	captureException = (err, context) =>
		Sentry.captureException(err, scope => {
			if (context) scope.setExtras(context);
			return scope;
		}),
	flushErrors = () => Sentry.close(2_000)
}: LifecycleOptions) => {
	const hooks: ShutdownHook[] = [];

	// Gates re-entry across every callback below. Once shutdown has begun
	// (or `uncaughtException` has fired), further async errors are logged
	// best-effort but must not re-trigger a handler that could exit or kick
	// off a second shutdown.
	let exiting = false;
	let shuttingDown = false;

	const runHook = async (hook: ShutdownHook) => {
		const limit = hook.timeoutMs ?? hookTimeoutMs;
		let timer: ReturnType<typeof setTimeout> | undefined;

		const timeout = new Promise<'timeout'>(resolve => {
			timer = setTimeout(() => resolve('timeout'), limit);
		});

		try {
			const result = await Promise.race([(async () => hook.run())(), timeout]);

			if (result === 'timeout') {
				logger.warn(
					{ hook: hook.name, stage: hook.stage, ms: limit },
					'shutdown.hook_timeout'
				);
			}
		} catch (err) {
			logger.warn(
				{ err, hook: hook.name, stage: hook.stage },
				'shutdown.hook_failed'
			);
		} finally {
			if (timer) clearTimeout(timer);
		}
	};

	const shutdown = async (signal: string) => {
		if (shuttingDown) return;
		shuttingDown = true;
		exiting = true;

		logger.info({ signal, hooks: hooks.length }, 'shutdown.start');

		// Hard cap so a stuck dependency can't block the orchestrator forever.
		const force = setTimeout(() => {
			logger.error({ signal }, 'shutdown.forced');
			exit(1);
		}, forceExitAfterMs);

		force.unref?.();

		try {
			for (const stage of STAGE_ORDER) {
				const staged = hooks.filter(hook => hook.stage === stage);

				if (staged.length === 0) continue;

				await Promise.all(staged.map(runHook));
				logger.info({ stage }, 'shutdown.stage_complete');
			}

			logger.info('shutdown.complete');
		} finally {
			clearTimeout(force);
			exit(0);
		}
	};

	const onShutdown = (hook: ShutdownHook) => {
		hooks.push(hook);
	};

	const install = () => {
		process.on('SIGTERM', () => {
			void shutdown('SIGTERM');
		});

		process.on('SIGINT', () => {
			void shutdown('SIGINT');
		});

		process.on('unhandledRejection', (reason, promise) => {
			if (exiting) {
				// Best-effort log only — the error reporter may already be closed.
				try {
					logger.error({ err: reason }, 'unhandled_rejection.during_exit');
				} catch {
					// Logger transport may have closed too. Swallow.
				}
				return;
			}

			logger.error({ err: reason }, 'unhandled_rejection');
			captureException(reason, { promise: String(promise) });
		});

		process.on('uncaughtException', err => {
			if (exiting) {
				try {
					logger.fatal({ err }, 'uncaught_exception.during_exit');
				} catch {
					// Same — last-ditch.
				}
				return;
			}

			exiting = true;
			logger.fatal({ err }, 'uncaught_exception');
			captureException(err);

			void Promise.resolve(flushErrors())
				.catch(() => {})
				.finally(() => exit(1));
		});
	};

	return { onShutdown, shutdown, install, isExiting: () => exiting };
};

export type Lifecycle = ReturnType<typeof createLifecycle>;
