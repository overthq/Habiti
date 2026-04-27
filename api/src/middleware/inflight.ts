import { createMiddleware } from 'hono/factory';

import type { AppEnv } from '../types/hono';

/**
 * Tracks the number of HTTP requests currently being handled. The boot
 * module reads this during graceful shutdown so we can wait for in-flight
 * requests to drain before exiting.
 *
 * `Bun.serve().stop(false)` returns synchronously and only marks the
 * server as no-longer-accepting connections — it does NOT wait for active
 * handlers to finish. This counter is what makes the wait real.
 */

let count = 0;
const waiters: Array<() => void> = [];

export const inFlightCount = () => count;

/** Promise that resolves once the in-flight count drops to 0. */
export const whenIdle = (): Promise<void> => {
	if (count === 0) return Promise.resolve();

	return new Promise<void>(resolve => {
		waiters.push(resolve);
	});
};

const decrement = () => {
	count--;

	if (count === 0) {
		while (waiters.length > 0) {
			waiters.shift()!();
		}
	}
};

export const inflightMiddleware = createMiddleware<AppEnv>(async (_c, next) => {
	count++;

	try {
		await next();
	} finally {
		decrement();
	}
});
