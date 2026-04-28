import { describe, expect, test } from 'bun:test';
import { createHmac } from 'crypto';

import { timingSafeEqualString } from './timingSafe';

describe('timingSafeEqualString', () => {
	test('matches identical strings', () => {
		expect(timingSafeEqualString('abc', 'abc')).toBe(true);
	});

	test('rejects unequal-length strings without throwing', () => {
		// timingSafeEqual itself throws on length mismatch — this wrapper
		// must short-circuit instead.
		expect(timingSafeEqualString('abc', 'abcd')).toBe(false);
		expect(timingSafeEqualString('', 'abc')).toBe(false);
	});

	test('rejects equal-length but different strings', () => {
		expect(timingSafeEqualString('abcd', 'efgh')).toBe(false);
	});

	test('rejects empty strings (defensive — no signature at all)', () => {
		expect(timingSafeEqualString('', '')).toBe(false);
	});

	test('matches a real-world HMAC-SHA512 signature pair', () => {
		const secret = 'paystack-test-secret';
		const body = JSON.stringify({ event: 'charge.success', data: {} });
		const sig = createHmac('sha512', secret).update(body).digest('hex');

		expect(timingSafeEqualString(sig, sig)).toBe(true);
		// Mutate one byte → must reject.
		const mutated =
			sig.slice(0, sig.length - 1) + (sig.slice(-1) === 'a' ? 'b' : 'a');
		expect(timingSafeEqualString(sig, mutated)).toBe(false);
	});
});
