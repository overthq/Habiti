import { metrics, MetricNames, type Tags } from '../services/metrics';
import { tracer } from '../services/tracer';

/**
 * Wraps an external/network call with a span + duration histogram + error
 * counter. Use for Paystack, Cloudinary, Loops, and any other outbound
 * service call so every hop becomes observable.
 *
 * Tag with at least `target` (e.g. `paystack`) and `op` (e.g. `chargeAuth`).
 */
export const instrument = async <T>(
	name: string,
	fn: () => Promise<T>,
	tags: Tags = {}
): Promise<T> => {
	const start = performance.now();
	return tracer.startSpan(
		`external.${name}`,
		async () => {
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
		},
		{ ...tags, target: name }
	);
};
