import {
	trace,
	SpanStatusCode,
	type Tracer as OTelTracer,
	type Span,
	type Attributes
} from '@opentelemetry/api';

import { env } from '../config/env';

/**
 * OTel-shaped tracer. We import `@opentelemetry/api` only — without an SDK
 * registered, every call returns a no-op span. The shape is correct so that
 * registering an OTel SDK later (OTLP exporter, Sentry tracing, etc.) makes
 * every existing `tracer.startSpan(...)` call emit real spans without any
 * code changes in callers.
 */
export interface Tracer {
	/** Wrap an async function in a span — auto-captures errors and timing. */
	startSpan<T>(
		name: string,
		fn: (span: Span) => Promise<T>,
		attributes?: Attributes
	): Promise<T>;
	/** Escape hatch to the underlying OTel tracer for advanced use. */
	raw: OTelTracer;
}

const buildTracer = (name: string): Tracer => {
	const otel = trace.getTracer(name);

	return {
		raw: otel,
		async startSpan(spanName, fn, attributes) {
			const span = otel.startSpan(spanName, attributes ? { attributes } : {});
			try {
				const result = await fn(span);
				span.setStatus({ code: SpanStatusCode.OK });
				return result;
			} catch (err) {
				span.recordException(err as Error);
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: (err as Error)?.message
				});
				throw err;
			} finally {
				span.end();
			}
		}
	};
};

export const tracer: Tracer = buildTracer(env.OTEL_SERVICE_NAME);
