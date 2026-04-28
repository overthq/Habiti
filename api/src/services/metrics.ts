/**
 * In-process metrics registry. Counters + histograms with a Prometheus text
 * exposition. Bounded memory: histograms keep at most `HISTOGRAM_RING_SIZE`
 * recent observations per tag-set.
 *
 * This is intentionally not the OTel `metrics` API — that surface is still
 * shifting, and we want a simple, scrapable store today. When we wire OTel
 * exporters we'll dual-write or move callers to OTel `Meter` directly.
 */

export type Tags = Record<string, string | number>;

const HISTOGRAM_RING_SIZE = 5_000;
const HISTOGRAM_BUCKETS_MS = [
	5, 10, 25, 50, 100, 250, 500, 1_000, 2_500, 5_000, 10_000
] as const;

const counters = new Map<string, Map<string, number>>();
const histograms = new Map<string, Map<string, number[]>>();

const tagKey = (tags?: Tags): string => {
	if (!tags) return '';
	const entries = Object.entries(tags);
	if (entries.length === 0) return '';
	return entries
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}=${String(v)}`)
		.join(',');
};

const parseTagKey = (key: string): Tags => {
	if (!key) return {};
	const out: Tags = {};
	for (const part of key.split(',')) {
		const eq = part.indexOf('=');
		if (eq < 0) continue;
		out[part.slice(0, eq)] = part.slice(eq + 1);
	}
	return out;
};

const renderLabels = (tags: Tags): string => {
	const entries = Object.entries(tags);
	if (entries.length === 0) return '';
	const inner = entries
		.map(([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`)
		.join(',');
	return `{${inner}}`;
};

const promName = (name: string) => name.replace(/\./g, '_');

export const metrics = {
	inc(name: string, tags?: Tags, by = 1): void {
		let store = counters.get(name);
		if (!store) {
			store = new Map();
			counters.set(name, store);
		}
		const key = tagKey(tags);
		store.set(key, (store.get(key) ?? 0) + by);
	},

	observe(name: string, value: number, tags?: Tags): void {
		let store = histograms.get(name);

		if (!store) {
			store = new Map();
			histograms.set(name, store);
		}

		const key = tagKey(tags);
		let arr = store.get(key);

		if (!arr) {
			arr = [];
			store.set(key, arr);
		}

		arr.push(value);

		if (arr.length > HISTOGRAM_RING_SIZE) {
			arr.splice(0, arr.length - HISTOGRAM_RING_SIZE);
		}
	},

	/** Reset the entire registry — handy for tests. */
	reset(): void {
		counters.clear();
		histograms.clear();
	},

	/**
	 * Render the registry in Prometheus text exposition format. Counters get
	 * `# TYPE foo counter`; histograms get bucketed cumulative counts plus
	 * `_sum` and `_count`.
	 */
	snapshotPrometheus(): string {
		const lines: string[] = [];

		for (const [name, store] of counters) {
			const promMetric = promName(name);
			lines.push(`# TYPE ${promMetric} counter`);

			for (const [key, val] of store) {
				lines.push(`${promMetric}${renderLabels(parseTagKey(key))} ${val}`);
			}
		}

		for (const [name, store] of histograms) {
			const promMetric = promName(name);
			lines.push(`# TYPE ${promMetric} histogram`);
			for (const [key, samples] of store) {
				const labels = parseTagKey(key);
				let cumulative = 0;
				const sortedSamples = [...samples].sort((a, b) => a - b);

				let cursor = 0;

				for (const bucket of HISTOGRAM_BUCKETS_MS) {
					while (
						cursor < sortedSamples.length &&
						sortedSamples[cursor]! <= bucket
					) {
						cursor++;
					}

					cumulative = cursor;
					const bucketLabels = renderLabels({ ...labels, le: bucket });
					lines.push(`${promMetric}_bucket${bucketLabels} ${cumulative}`);
				}

				const infLabels = renderLabels({ ...labels, le: '+Inf' });
				lines.push(`${promMetric}_bucket${infLabels} ${samples.length}`);

				const sum = samples.reduce((a, b) => a + b, 0);
				lines.push(`${promMetric}_sum${renderLabels(labels)} ${sum}`);
				lines.push(
					`${promMetric}_count${renderLabels(labels)} ${samples.length}`
				);
			}
		}

		return lines.join('\n') + '\n';
	}
};

// Pre-declared metric names. Centralising them so we don't get typo-divergent
// names like `http_request_total` vs `http.requests.total` over time.
export const MetricNames = {
	HttpRequests: 'http.server.requests',
	HttpDuration: 'http.server.duration_ms',
	DbQueryDuration: 'db.query.duration_ms',
	DbSlowQueries: 'db.slow_queries',
	RedisOpDuration: 'redis.op.duration_ms',
	ExternalCallDuration: 'external.call.duration_ms',
	ExternalCallErrors: 'external.call.errors',
	RateLimitBlocked: 'ratelimit.blocked',
	LedgerWrites: 'ledger.writes',
	InventoryOversellAttempts: 'inventory.oversell_attempts',
	ErrorsByClass: 'errors.by_class'
} as const;
