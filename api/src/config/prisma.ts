import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { env } from './env';
import { rootLogger } from '../services/logger';
import { metrics, MetricNames } from '../services/metrics';

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL
});

const prismaClient = new PrismaClient({
	adapter,
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
				// Only log the SQL itself outside production — params can leak PII.
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

export default prismaClient;
