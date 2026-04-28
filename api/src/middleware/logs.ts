import { createMiddleware } from 'hono/factory';
import { routePath } from 'hono/route';
import { randomUUID, randomBytes } from 'crypto';

import type { AppEnv } from '../types/hono';
import { rootLogger } from '../services/logger';
import { metrics, MetricNames } from '../services/metrics';

const newTraceparent = () =>
	`00-${randomBytes(16).toString('hex')}-${randomBytes(8).toString('hex')}-01`;

const TRACEPARENT_RE =
	/^[0-9a-f]{2}-([0-9a-f]{32})-([0-9a-f]{16})-[0-9a-f]{2}$/i;

const parseTraceparent = (tp: string | undefined) => {
	if (!tp) return {} as { traceId?: string; spanId?: string };
	const match = TRACEPARENT_RE.exec(tp);
	if (!match) return {} as { traceId?: string; spanId?: string };
	return { traceId: match[1]!, spanId: match[2]! };
};

const logsMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const requestId = c.req.header('x-request-id') ?? randomUUID();
	const incoming = c.req.header('traceparent');
	const traceparent =
		incoming && TRACEPARENT_RE.test(incoming) ? incoming : newTraceparent();
	const { traceId, spanId } = parseTraceparent(traceparent);

	const logger = rootLogger.child({
		requestId,
		traceId,
		spanId,
		method: c.req.method,
		path: c.req.path
	});

	c.set('logger', logger);
	c.set('requestId', requestId);
	c.set('traceId', traceId ?? requestId);

	c.header('x-request-id', requestId);
	c.header('traceparent', traceparent);

	const start = performance.now();

	try {
		await next();
	} finally {
		const duration_ms = Math.round(performance.now() - start);
		const status = c.res.status;
		const route = routePath(c) ?? c.req.path;

		metrics.inc(MetricNames.HttpRequests, {
			method: c.req.method,
			route,
			status
		});

		metrics.observe(MetricNames.HttpDuration, duration_ms, {
			method: c.req.method,
			route,
			status
		});

		const fields = {
			status,
			duration_ms,
			userId: c.var.auth?.id,
			storeId: c.var.storeId
		};

		if (status >= 500) logger.error(fields, 'request_finished');
		else if (status >= 400) logger.warn(fields, 'request_finished');
		else logger.info(fields, 'request_finished');
	}
});

export default logsMiddleware;
