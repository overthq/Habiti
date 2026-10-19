import { metrics, MetricNames, type Tags } from '../services/metrics';
import { tracer } from '../services/tracer';

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
