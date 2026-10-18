import { metrics, MetricNames, type Tags } from '../services/metrics';

/**
 * Records a duration histogram and, on failure, an error counter around an
 * outbound call (Paystack, Cloudinary, Loops). Pass `op` (for example
 * `chargeAuth`). `target` is set from `name`.
 *
 * This does not open a trace span. Sentry is the trace backend.
 */
export const instrument = async <T>(
	name: string,
	fn: () => Promise<T>,
	tags: Tags = {}
): Promise<T> => {
	const start = performance.now();

	try {
		const result = await fn();
		const duration = performance.now() - start;

		metrics.observe(MetricNames.ExternalCallDuration, duration, {
			...tags,
			target: name,
			ok: 1
		});

		return result;
	} catch (err) {
		const duration = performance.now() - start;

		metrics.observe(MetricNames.ExternalCallDuration, duration, {
			...tags,
			target: name,
			ok: 0
		});

		metrics.inc(MetricNames.ExternalCallErrors, {
			...tags,
			target: name
		});

		throw err;
	}
};
