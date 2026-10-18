import { describe, expect, test } from 'bun:test';

import { metrics, MetricNames } from '../services/metrics';
import { instrument } from './instrument';

describe('instrument', () => {
	test('records a successful duration without an error counter', async () => {
		metrics.reset();

		const result = await instrument('paystack', async () => 'ok', {
			op: 'charge'
		});

		expect(result).toBe('ok');
		const snap = metrics.snapshotPrometheus();
		expect(snap).toContain(
			`# TYPE ${MetricNames.ExternalCallDuration.replace(/\./g, '_')} histogram`
		);
		expect(snap).toContain('target="paystack"');
		expect(snap).toContain('op="charge"');
		expect(snap).toContain('ok="1"');
		expect(snap).not.toContain('external_call_errors');
	});

	test('records an error counter and rethrows', async () => {
		metrics.reset();

		await expect(
			instrument(
				'loops',
				async () => {
					throw new Error('nope');
				},
				{ op: 'send' }
			)
		).rejects.toThrow('nope');

		const snap = metrics.snapshotPrometheus();
		expect(snap).toContain('target="loops"');
		expect(snap).toContain('op="send"');
		expect(snap).toContain('ok="0"');
		expect(snap).toContain('external_call_errors');
		expect(snap).toContain('external_call_errors{op="send",target="loops"} 1');
	});
});
