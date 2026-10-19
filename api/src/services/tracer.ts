import {
	SpanStatusCode,
	trace,
	type Attributes
} from '@opentelemetry/api';

import { env } from '../config/env';

export interface Tracer {
	startSpan<T>(
		name: string,
		fn: () => Promise<T>,
		attributes?: Record<string, string | number | boolean | undefined>
	): Promise<T>;
}

const attributesOf = (
	attributes?: Record<string, string | number | boolean | undefined>
): Attributes => {
	const clean: Attributes = {};

	if (!attributes) return clean;

	for (const [key, value] of Object.entries(attributes)) {
		if (value !== undefined) clean[key] = value;
	}

	return clean;
};

const describe = (err: unknown) =>
	err instanceof Error ? err.message : String(err);

export const tracer: Tracer = {
	async startSpan(name, fn, attributes) {
		const otel = trace.getTracer(env.OTEL_SERVICE_NAME);

		return otel.startActiveSpan(
			name,
			{ attributes: attributesOf(attributes) },
			async span => {
				try {
					const result = await fn();
					span.setStatus({ code: SpanStatusCode.OK });
					return result;
				} catch (err) {
					if (err instanceof Error) span.recordException(err);
					else span.recordException(String(err));

					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: describe(err)
					});
					throw err;
				} finally {
					span.end();
				}
			}
		);
	}
};
