import {
	PrismaClient as GeneratedPrismaClient,
	type Prisma
} from '../generated/prisma/client';
import type { ITXClientDenyList } from '@prisma/client/runtime/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { env } from './env';
import { rootLogger } from '../services/logger';
import { metrics, MetricNames } from '../services/metrics';

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL
});

// Declared separately because inline, Prisma loses the omit types once more
// than one model is listed.
const omit = {
	user: { passwordHash: true, appleId: true },
	store: {
		unrealizedRevenue: true,
		realizedRevenue: true,
		paidOut: true,
		pendingPayouts: true,
		orderCount: true
	},
	admin: { passwordHash: true },
	card: { authorizationCode: true, signature: true }
} satisfies Prisma.GlobalOmitConfig;

const prismaClient = new GeneratedPrismaClient({
	adapter,
	omit,
	log: [
		{ emit: 'event', level: 'query' },
		{ emit: 'event', level: 'warn' },
		{ emit: 'event', level: 'error' }
	]
});

prismaClient.$on('query', e => {
	metrics.observe(MetricNames.DbQueryDuration, e.duration, {
		target: e.target ?? 'unknown'
	});

	if (e.duration >= env.SLOW_QUERY_THRESHOLD_MS) {
		metrics.inc(MetricNames.DbSlowQueries, { target: e.target ?? 'unknown' });
		rootLogger.warn(
			{
				duration_ms: e.duration,
				target: e.target,
				query: env.NODE_ENV === 'production' ? undefined : e.query,
				params: env.NODE_ENV === 'production' ? undefined : e.params
			},
			'db.slow_query'
		);
	} else {
		rootLogger.trace({ duration_ms: e.duration, target: e.target }, 'db.query');
	}
});

prismaClient.$on('warn', e => {
	rootLogger.warn({ target: e.target, message: e.message }, 'db.warn');
});

prismaClient.$on('error', e => {
	rootLogger.error({ target: e.target, message: e.message }, 'db.error');
});

export type PrismaClient = typeof prismaClient;
export type TransactionClient = Omit<PrismaClient, ITXClientDenyList>;

export default prismaClient;
