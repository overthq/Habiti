import { describe, expect, test } from 'bun:test';

import { createTestApp } from '../test/helpers';
import { resolveRequestTrace } from './logs';

const TRACEPARENT_RE = /^[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i;

const incoming = `00-${'ab'.repeat(16)}-${'cd'.repeat(8)}-01`;

describe('resolveRequestTrace', () => {
	test('uses the active Sentry span instead of an inbound traceparent', () => {
		const traceId = 'a'.repeat(32);
		const spanId = 'b'.repeat(16);
		const resolved = resolveRequestTrace(incoming, {
			traceId,
			spanId,
			sampled: true
		});

		expect(resolved.traceId).toBe(traceId);
		expect(resolved.spanId).toBe(spanId);
		expect(resolved.traceparent).toBe(`00-${traceId}-${spanId}-01`);
	});

	test('writes flags 00 when the Sentry span is not sampled', () => {
		const resolved = resolveRequestTrace(undefined, {
			traceId: 'e'.repeat(32),
			spanId: 'f'.repeat(16),
			sampled: false
		});

		expect(resolved.traceparent.endsWith('-00')).toBe(true);
	});

	test('echoes a valid inbound traceparent when no Sentry span is active', () => {
		const resolved = resolveRequestTrace(incoming, undefined);

		expect(resolved.traceparent).toBe(incoming);
		expect(resolved.traceId).toBe('ab'.repeat(16));
		expect(resolved.spanId).toBe('cd'.repeat(8));
	});

	test('mints a traceparent when the inbound header is missing or invalid', () => {
		expect(resolveRequestTrace(undefined, undefined).traceparent).toMatch(
			TRACEPARENT_RE
		);

		const invalid = resolveRequestTrace('not-a-trace', undefined);
		expect(invalid.traceparent).toMatch(TRACEPARENT_RE);
		expect(invalid.traceparent).not.toBe('not-a-trace');
	});

	test('ignores a Sentry span whose ids are not W3C hex', () => {
		const resolved = resolveRequestTrace(incoming, {
			traceId: 'nope',
			spanId: 'also-nope',
			sampled: true
		});

		expect(resolved.traceparent).toBe(incoming);
	});
});

describe('logsMiddleware traceparent', () => {
	test('echoes an inbound traceparent when Sentry has no active span', async () => {
		const { app } = createTestApp();
		const res = await app.request('/health/live', {
			headers: { traceparent: incoming }
		});

		expect(res.status).toBe(200);
		expect(res.headers.get('traceparent')).toBe(incoming);
		expect(res.headers.get('x-request-id')).toBeTruthy();
	});

	test('mints a traceparent when the request has none', async () => {
		const { app } = createTestApp();
		const res = await app.request('/health/live');

		expect(res.status).toBe(200);
		expect(res.headers.get('traceparent')).toMatch(TRACEPARENT_RE);
	});
});
