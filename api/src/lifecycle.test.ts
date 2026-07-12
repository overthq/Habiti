import { describe, expect, test } from 'bun:test';

import { createLifecycle, type LifecycleOptions } from './lifecycle';
import type { Logger } from './services/logger';

const noopLogger = {
	info: () => {},
	warn: () => {},
	error: () => {},
	fatal: () => {},
	trace: () => {},
	debug: () => {}
} as unknown as Logger;

const setup = (options: Partial<LifecycleOptions> = {}) => {
	const exitCodes: number[] = [];

	const lifecycle = createLifecycle({
		logger: noopLogger,
		exit: code => {
			exitCodes.push(code);
		},
		captureException: () => {},
		flushErrors: async () => {},
		...options
	});

	return { lifecycle, exitCodes };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('createLifecycle', () => {
	test('runs stages in order and exits cleanly', async () => {
		const { lifecycle, exitCodes } = setup();
		const ran: string[] = [];

		// Registered out of stage order — the lifecycle should still run them
		// accept → drain → workers → connections.
		lifecycle.onShutdown({
			name: 'redis',
			stage: 'connections',
			run: () => ran.push('redis')
		});
		lifecycle.onShutdown({
			name: 'analytics',
			stage: 'workers',
			run: () => ran.push('analytics')
		});
		lifecycle.onShutdown({
			name: 'server',
			stage: 'accept',
			run: () => ran.push('server')
		});
		lifecycle.onShutdown({
			name: 'inflight',
			stage: 'drain',
			run: () => ran.push('inflight')
		});

		await lifecycle.shutdown('SIGTERM');

		expect(ran).toEqual(['server', 'inflight', 'analytics', 'redis']);
		expect(exitCodes).toEqual([0]);
	});

	test('a failing hook does not strand the remaining stages', async () => {
		const { lifecycle, exitCodes } = setup();
		const ran: string[] = [];

		lifecycle.onShutdown({
			name: 'boom',
			stage: 'workers',
			run: () => {
				throw new Error('worker blew up');
			}
		});
		lifecycle.onShutdown({
			name: 'prisma',
			stage: 'connections',
			run: () => ran.push('prisma')
		});

		await lifecycle.shutdown('SIGTERM');

		expect(ran).toEqual(['prisma']);
		expect(exitCodes).toEqual([0]);
	});

	test('a hung hook is capped by its timeout and the sequence proceeds', async () => {
		const { lifecycle, exitCodes } = setup({ hookTimeoutMs: 20 });
		const ran: string[] = [];

		lifecycle.onShutdown({
			name: 'never-settles',
			stage: 'drain',
			run: () => new Promise(() => {})
		});
		lifecycle.onShutdown({
			name: 'redis',
			stage: 'connections',
			run: () => ran.push('redis')
		});

		await lifecycle.shutdown('SIGTERM');

		expect(ran).toEqual(['redis']);
		expect(exitCodes).toEqual([0]);
	});

	test('hooks in the same stage run in parallel', async () => {
		const { lifecycle } = setup();
		let inFlight = 0;
		let maxParallel = 0;

		const concurrent = () => async () => {
			inFlight++;
			maxParallel = Math.max(maxParallel, inFlight);
			await delay(10);
			inFlight--;
		};

		lifecycle.onShutdown({
			name: 'a',
			stage: 'workers',
			run: concurrent()
		});
		lifecycle.onShutdown({
			name: 'b',
			stage: 'workers',
			run: concurrent()
		});

		await lifecycle.shutdown('SIGTERM');

		expect(maxParallel).toBe(2);
	});

	test('a second signal mid-shutdown is a no-op', async () => {
		const { lifecycle, exitCodes } = setup();
		let runs = 0;

		lifecycle.onShutdown({
			name: 'slow',
			stage: 'workers',
			run: async () => {
				runs++;
				await delay(20);
			}
		});

		const first = lifecycle.shutdown('SIGTERM');
		const second = lifecycle.shutdown('SIGINT');

		await Promise.all([first, second]);

		expect(runs).toBe(1);
		expect(exitCodes).toEqual([0]);
	});

	test('force-exits with code 1 when the sequence overruns its budget', async () => {
		const { lifecycle, exitCodes } = setup({
			forceExitAfterMs: 10,
			// Higher than the force cap, so the hook is still hanging when the
			// hard deadline fires.
			hookTimeoutMs: 500
		});

		lifecycle.onShutdown({
			name: 'hangs',
			stage: 'drain',
			run: () => delay(200)
		});

		await lifecycle.shutdown('SIGTERM');

		expect(exitCodes[0]).toBe(1);
	});

	test('isExiting flips once shutdown begins', async () => {
		const { lifecycle } = setup();

		expect(lifecycle.isExiting()).toBe(false);

		await lifecycle.shutdown('SIGTERM');

		expect(lifecycle.isExiting()).toBe(true);
	});
});
