import './config/sentry';

import * as Sentry from '@sentry/bun';

import { createApp } from './app';
import { createLifecycle } from './lifecycle';
import { peekServices } from './dependencies';
import { inFlightCount, whenIdle } from './middleware/inflight';

import { rootLogger } from './services/logger';
import { env } from './config/env';
import redisClient from './config/redis';
import prismaClient from './config/prisma';

const DRAIN_TIMEOUT_MS = 15_000;

const main = async () => {
	await redisClient.connect();

	const app = createApp();
	const lifecycle = createLifecycle({ logger: rootLogger });

	const server = Bun.serve({
		port: Number(env.PORT),
		fetch: app.fetch
	});

	lifecycle.onShutdown({
		name: 'server',
		stage: 'accept',
		run: () => server.stop(false)
	});

	lifecycle.onShutdown({
		name: 'inflight',
		stage: 'drain',
		timeoutMs: DRAIN_TIMEOUT_MS,
		run: async () => {
			await whenIdle();
			rootLogger.info(
				{ inflight: inFlightCount() },
				'shutdown.inflight_drained'
			);
		}
	});

	lifecycle.onShutdown({
		name: 'notifications',
		stage: 'workers',
		run: () => peekServices()?.notifications.flush()
	});

	lifecycle.onShutdown({
		name: 'analytics',
		stage: 'workers',
		run: async () => {
			const services = peekServices();

			if (!services) return;

			await services.analytics.flush();
			await services.analytics.shutdown();
		}
	});

	lifecycle.onShutdown({
		name: 'prisma',
		stage: 'connections',
		run: () => prismaClient.$disconnect()
	});

	lifecycle.onShutdown({
		name: 'redis',
		stage: 'connections',
		run: () => redisClient.close()
	});

	lifecycle.onShutdown({
		name: 'sentry',
		stage: 'connections',
		run: () => Sentry.close(2_000)
	});

	lifecycle.install();

	rootLogger.info({ port: env.PORT }, 'server_started');
};

main();
