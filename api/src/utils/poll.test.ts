import { describe, expect, test } from 'bun:test';

import { pollUntil } from './poll';

describe('pollUntil', () => {
	test('stops as soon as fn returns truthy', async () => {
		let calls = 0;

		await pollUntil(
			async () => {
				calls++;
				return calls === 2;
			},
			{ intervalMs: 1, maxAttempts: 10 }
		);

		expect(calls).toBe(2);
	});

	test('gives up after maxAttempts', async () => {
		let calls = 0;

		await pollUntil(
			async () => {
				calls++;
				return false;
			},
			{ intervalMs: 1, maxAttempts: 4 }
		);

		expect(calls).toBe(4);
	});

	test('treats a throwing fn as "not ready yet"', async () => {
		let calls = 0;

		await pollUntil(
			async () => {
				calls++;
				if (calls < 3) throw new Error('not ready');
				return true;
			},
			{ intervalMs: 1, maxAttempts: 10 }
		);

		expect(calls).toBe(3);
	});

	test('never runs attempts concurrently, even when fn is slower than the interval', async () => {
		let inFlight = 0;
		let maxInFlight = 0;

		await pollUntil(
			async () => {
				inFlight++;
				maxInFlight = Math.max(maxInFlight, inFlight);
				await new Promise(resolve => setTimeout(resolve, 20));
				inFlight--;
				return false;
			},
			{ intervalMs: 1, maxAttempts: 4 }
		);

		expect(maxInFlight).toBe(1);
	});
});
