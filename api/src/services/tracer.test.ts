import { describe, expect, test } from 'bun:test';

import { tracer } from './tracer';

describe('tracer', () => {
	test('runs the function and returns its value', async () => {
		const value = await tracer.startSpan('order.create', async () => 7, {
			status: 'pending'
		});

		expect(value).toBe(7);
	});

	test('rethrows the wrapped error', async () => {
		await expect(
			tracer.startSpan('order.create', async () => {
				throw new Error('boom');
			})
		).rejects.toThrow('boom');
	});
});
