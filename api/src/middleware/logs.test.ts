import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { Hono } from 'hono';
import { context, propagation, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import {
	BasicTracerProvider,
	InMemorySpanExporter,
	SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base';

import type { AppEnv } from '../types/hono';
import { tracer } from '../services/tracer';
import logsMiddleware from './logs';

const TRACEPARENT_RE = /^00-([0-9a-f]{32})-([0-9a-f]{16})-0[01]$/;
const inboundTraceId = 'ab'.repeat(16);
const inbound = `00-${inboundTraceId}-${'cd'.repeat(8)}-01`;

const app = new Hono<AppEnv>();
app.use('*', logsMiddleware);
app.get('/orders/:id', c =>
	tracer.startSpan('order.load', async () => c.json({ id: c.req.param('id') }))
);

describe('logsMiddleware without a tracer provider', () => {
	test('echoes a valid inbound traceparent', async () => {
		const res = await app.request('/orders/1', {
			headers: { traceparent: inbound }
		});

		expect(res.headers.get('traceparent')).toBe(inbound);
	});

	test('mints a traceparent when the inbound one is missing or invalid', async () => {
		const res = await app.request('/orders/1', {
			headers: { traceparent: 'nope' }
		});

		expect(res.headers.get('traceparent')).toMatch(TRACEPARENT_RE);
	});
});

describe('logsMiddleware with a tracer provider', () => {
	const exporter = new InMemorySpanExporter();
	const provider = new BasicTracerProvider({
		spanProcessors: [new SimpleSpanProcessor(exporter)]
	});

	beforeAll(() => {
		context.setGlobalContextManager(
			new AsyncLocalStorageContextManager().enable()
		);
		propagation.setGlobalPropagator(new W3CTraceContextPropagator());
		trace.setGlobalTracerProvider(provider);
	});

	afterAll(async () => {
		await provider.shutdown();
		trace.disable();
		propagation.disable();
		context.disable();
	});

	test('continues the inbound trace and parents app spans to the request span', async () => {
		exporter.reset();

		const res = await app.request('/orders/1', {
			headers: { traceparent: inbound }
		});

		const [, traceId, spanId] = TRACEPARENT_RE.exec(
			res.headers.get('traceparent')!
		)!;
		expect(traceId).toBe(inboundTraceId);

		const spans = exporter.getFinishedSpans();
		const server = spans.find(s => s.name === 'GET /orders/:id')!;
		const child = spans.find(s => s.name === 'order.load')!;

		expect(server.spanContext().spanId).toBe(spanId!);
		expect(server.attributes['http.response.status_code']).toBe(200);
		expect(child.parentSpanContext?.spanId).toBe(spanId!);
		expect(child.spanContext().traceId).toBe(inboundTraceId);
	});
});
