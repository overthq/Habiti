import { trace, SpanStatusCode, type Attributes } from '@opentelemetry/api';

import { env } from '../config/env';

export interface Tracer {
	startSpan<T>(
		name: string,
		fn: () => Promise<T>,
		attributes?: Attributes
	): Promise<T>;
}

const otel = trace.getTracer(env.OTEL_SERVICE_NAME);

export const tracer: Tracer = {
	startSpan(name, fn, attributes = {}) {
		return otel.startActiveSpan(name, { attributes }, async span => {
			try {
				const result = await fn();
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
		});
	}
};
