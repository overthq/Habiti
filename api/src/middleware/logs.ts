import { createMiddleware } from 'hono/factory';
import { routePath } from 'hono/route';
import { randomUUID, randomBytes } from 'crypto';
import * as Sentry from '@sentry/bun';

import type { AppEnv } from '../types/hono';
import { rootLogger } from '../services/logger';
import { metrics, MetricNames } from '../services/metrics';

const newTraceparent = () =>
	`00-${randomBytes(16).toString('hex')}-${randomBytes(8).toString('hex')}-01`;

const TRACEPARENT_RE =
	/^[0-9a-f]{2}-([0-9a-f]{32})-([0-9a-f]{16})-[0-9a-f]{2}$/i;

const HEX_TRACE_ID = /^[0-9a-f]{32}$/i;
const HEX_SPAN_ID = /^[0-9a-f]{16}$/i;

const parseTraceparent = (tp: string | undefined) => {
	if (!tp) return {} as { traceId?: string; spanId?: string };
	const match = TRACEPARENT_RE.exec(tp);
	if (!match) return {} as { traceId?: string; spanId?: string };
	return { traceId: match[1]!, spanId: match[2]! };
};

export type ActiveTrace = {
	traceId: string;
	spanId: string;
	sampled: boolean;
};

/**
 * Prefer the active Sentry span so the log `traceId` and the response
 * `traceparent` match Sentry's trace. Sentry's Bun server integration
 * continues `sentry-trace` / `baggage`, not an inbound W3C `traceparent`,
 * and it does not start a span for `OPTIONS` / `HEAD` or for `app.fetch`
 * outside `Bun.serve`. With no usable span, keep the inbound header or
 * mint one.
 */
export const resolveRequestTrace = (
	incoming: string | undefined,
	active: ActiveTrace | undefined
): { traceparent: string; traceId: string; spanId: string } => {
	if (
		active &&
		HEX_TRACE_ID.test(active.traceId) &&
		HEX_SPAN_ID.test(active.spanId)
	) {
		const flags = active.sampled ? '01' : '00';

		return {
			traceparent: `00-${active.traceId}-${active.spanId}-${flags}`,
			traceId: active.traceId,
			spanId: active.spanId
		};
	}

	const traceparent =
		incoming && TRACEPARENT_RE.test(incoming) ? incoming : newTraceparent();
	const parsed = parseTraceparent(traceparent);

	return {
		traceparent,
		traceId: parsed.traceId!,
		spanId: parsed.spanId!
	};
};

const readActiveSentryTrace = (): ActiveTrace | undefined => {
	const span = Sentry.getActiveSpan();
	if (!span) return undefined;

	const context = span.spanContext();
	if (!context?.traceId || !context.spanId) return undefined;

	return {
		traceId: context.traceId,
		spanId: context.spanId,
		sampled: (context.traceFlags & 1) === 1
	};
};

const logsMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const requestId = c.req.header('x-request-id') ?? randomUUID();
	const { traceparent, traceId, spanId } = resolveRequestTrace(
		c.req.header('traceparent'),
		readActiveSentryTrace()
	);

	const logger = rootLogger.child({
		requestId,
		traceId,
		spanId,
		method: c.req.method,
		path: c.req.path
	});

	c.set('logger', logger);
	c.set('requestId', requestId);
	c.set('traceId', traceId || requestId);

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
			route,
			userId: c.var.auth?.id,
			storeId: c.var.storeId
		};

		if (status >= 500) logger.error(fields, 'request_finished');
		else if (status >= 400) logger.warn(fields, 'request_finished');
		else logger.info(fields, 'request_finished');
	}
});

export default logsMiddleware;
