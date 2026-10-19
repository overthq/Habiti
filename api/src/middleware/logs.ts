import { createMiddleware } from 'hono/factory';
import { routePath } from 'hono/route';
import { randomUUID, randomBytes } from 'crypto';
import {
	context,
	isSpanContextValid,
	propagation,
	SpanKind,
	SpanStatusCode,
	trace,
	TraceFlags
} from '@opentelemetry/api';

import type { AppEnv } from '../types/hono';
import { env } from '../config/env';
import { rootLogger } from '../services/logger';
import { metrics, MetricNames } from '../services/metrics';

const otel = trace.getTracer(env.OTEL_SERVICE_NAME);

const newTraceparent = () =>
	`00-${randomBytes(16).toString('hex')}-${randomBytes(8).toString('hex')}-01`;

const TRACEPARENT_RE =
	/^[0-9a-f]{2}-([0-9a-f]{32})-([0-9a-f]{16})-[0-9a-f]{2}$/i;

const logsMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const parent = propagation.extract(context.active(), c.req.header());
	const attributes = {
		'http.request.method': c.req.method,
		'url.path': c.req.path
	};

	return otel.startActiveSpan(
		c.req.method,
		{ kind: SpanKind.SERVER, attributes },
		parent,
		async span => {
			const requestId = c.req.header('x-request-id') ?? randomUUID();
			const spanContext = span.spanContext();
			let traceparent: string;

			// Without a registered provider (tests, scripts) the span is a no-op,
			// so keep the caller's traceparent or mint one for log correlation.
			if (isSpanContextValid(spanContext)) {
				const flags = spanContext.traceFlags & TraceFlags.SAMPLED ? '01' : '00';
				traceparent = `00-${spanContext.traceId}-${spanContext.spanId}-${flags}`;
			} else {
				const incoming = c.req.header('traceparent');
				traceparent =
					incoming && TRACEPARENT_RE.test(incoming)
						? incoming
						: newTraceparent();
			}

			const [, traceId, spanId] = TRACEPARENT_RE.exec(traceparent)!;

			const logger = rootLogger.child({
				requestId,
				traceId,
				spanId,
				method: c.req.method,
				path: c.req.path
			});

			c.set('logger', logger);
			c.set('requestId', requestId);
			c.set('traceId', traceId!);

			c.header('x-request-id', requestId);
			c.header('traceparent', traceparent);

			const start = performance.now();

			try {
				await next();
			} finally {
				const duration_ms = Math.round(performance.now() - start);
				const status = c.res.status;
				const route = routePath(c) ?? c.req.path;

				span.updateName(`${c.req.method} ${route}`);
				span.setAttributes({
					'http.route': route,
					'http.response.status_code': status
				});
				if (status >= 500) span.setStatus({ code: SpanStatusCode.ERROR });
				span.end();

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
		}
	);
});

export default logsMiddleware;
