import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const apiRoot = path.resolve(import.meta.dir, '../..');

const requiredEnv = {
	JWT_SECRET: 'test-secret',
	CLOUDINARY_CLOUD_NAME: 'test',
	CLOUDINARY_API_KEY: 'test',
	CLOUDINARY_API_SECRET: 'test',
	PAYSTACK_SECRET_KEY: 'test',
	REDIS_URL: 'redis://127.0.0.1:6379',
	DATABASE_URL: 'postgresql://localhost:5432/market'
};

const runProbe = (
	script: string,
	overrides: Record<string, string | undefined> = {}
) => {
	const env: Record<string, string> = {};

	for (const [key, value] of Object.entries({
		...process.env,
		...requiredEnv,
		SENTRY_DSN: undefined,
		SENTRY_TRACES_SAMPLE_RATE: undefined,
		OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
		OTEL_EXPORTER_OTLP_HEADERS: undefined,
		...overrides
	})) {
		if (typeof value === 'string') env[key] = value;
	}

	const result = spawnSync(process.execPath, ['-e', script], {
		cwd: apiRoot,
		env,
		encoding: 'utf8',
		timeout: 20_000
	});

	const probeLine = result.stderr
		.split('\n')
		.reverse()
		.find(line => line.startsWith('PROBE '));

	return {
		status: result.status,
		stdout: result.stdout,
		stderr: result.stderr,
		probe: probeLine ? JSON.parse(probeLine.slice('PROBE '.length)) : null
	};
};

const dsn = 'https://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@127.0.0.1:9/1';

const selectionScript = `
import { isSpanContextValid, trace } from '@opentelemetry/api';
import * as Sentry from '@sentry/bun';
import {
  selectTraceProvider,
  getTelemetryState
} from './src/config/telemetry.ts';
import { tracer } from './src/services/tracer.ts';

const choices = {
  endpoint: selectTraceProvider({
    otlpEndpoint: 'http://127.0.0.1:4318',
    sentryDsn: 'https://dsn'
  }),
  dsn: selectTraceProvider({ sentryDsn: 'https://dsn' }),
  neither: selectTraceProvider({}),
  both: selectTraceProvider({
    otlpEndpoint: 'http://127.0.0.1:4318',
    sentryDsn: 'https://dsn'
  })
};

let recording = false;
await tracer.startSpan('order.create', async () => {
  const span = trace.getActiveSpan();
  const ctx = span?.spanContext();
  recording = Boolean(span && span.isRecording() && ctx && isSpanContextValid(ctx));
}, { status: 'pending' });

let shared = null;
if (Sentry.getClient()) {
  await Sentry.startSpan({ name: 'probe-span' }, async () => {
    const otelId = trace.getActiveSpan()?.spanContext().traceId ?? null;
    const sentryId = Sentry.getActiveSpan()?.spanContext().traceId ?? null;
    shared = { otelId, sentryId, same: Boolean(otelId) && otelId === sentryId };
  });
}

const client = Sentry.getClient();
const options = client?.getOptions();
console.error('PROBE ' + JSON.stringify({
  choices,
  state: getTelemetryState(),
  recording,
  shared,
  skipOpenTelemetrySetup: options?.skipOpenTelemetrySetup ?? null,
  tracesSampleRate: options?.tracesSampleRate ?? null,
  enableLogs: options?.enableLogs ?? null,
  names: options?.integrations.map(integration => integration.name) ?? [],
  traceProviderInstalled: Boolean(client && 'traceProvider' in client && client.traceProvider)
}));
process.exit(0);
`;

const memoryScript = `
import { context, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { tracer } from './src/services/tracer.ts';
import { instrument } from './src/utils/instrument.ts';

const exporter = new InMemorySpanExporter();
const provider = new BasicTracerProvider({
  resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: 'habiti-api' }),
  spanProcessors: [new SimpleSpanProcessor(exporter)]
});
context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());
trace.setGlobalTracerProvider(provider);

const parentTracer = trace.getTracer('habiti-api');
let thrown = null;
await parentTracer.startActiveSpan('request', async parent => {
  try {
    await tracer.startSpan('order.create', async () => {
      await instrument('paystack', async () => 'ok', { op: 'charge' });
    }, { status: 'pending' });
    try {
      await tracer.startSpan('order.fail', async () => {
        throw new Error('boom');
      });
    } catch (err) {
      thrown = err instanceof Error ? err.message : String(err);
    }
  } finally {
    parent.end();
  }
});

const spans = exporter.getFinishedSpans().map(span => ({
  name: span.name,
  spanId: span.spanContext().spanId,
  parent: span.parentSpanContext?.spanId ?? null,
  status: span.status.code,
  attributes: span.attributes,
  service: span.resource.attributes['service.name'] ?? null,
  exceptions: span.events.filter(event => event.name === 'exception').length
}));
console.error('PROBE ' + JSON.stringify({ thrown, spans }));
process.exit(0);
`;

const bootScript = `
import './src/config/telemetry.ts';
import { getTelemetryState } from './src/config/telemetry.ts';
import { createApp } from './src/app.ts';

const app = createApp();
const res = await app.fetch(new Request('http://127.0.0.1/health/live'));
console.error('PROBE ' + JSON.stringify({
  status: res.status,
  traceparent: res.headers.get('traceparent'),
  state: getTelemetryState()
}));
process.exit(0);
`;

const listenerChild = `
import { trace } from '@opentelemetry/api';
import './src/config/telemetry.ts';
import { tracer } from './src/services/tracer.ts';
import { shutdownTelemetry, getTelemetryState } from './src/config/telemetry.ts';

let traceId = null;
await tracer.startSpan('order.create', async () => {
  traceId = trace.getActiveSpan()?.spanContext().traceId ?? null;
}, { status: 'pending' });
await shutdownTelemetry();
console.error('PROBE ' + JSON.stringify({
  state: getTelemetryState(),
  traceId
}));
process.exit(0);
`;

describe('trace provider selection', () => {
	test('an OTLP endpoint is the trace exporter, including when a DSN is set', () => {
		const { status, stderr, probe } = runProbe(selectionScript, {
			OTEL_EXPORTER_OTLP_ENDPOINT: 'http://127.0.0.1:9',
			SENTRY_DSN: dsn,
			NODE_ENV: 'development'
		});

		expect(status, stderr).toBe(0);
		expect(probe.choices).toEqual({
			endpoint: 'otlp',
			dsn: 'sentry',
			neither: 'none',
			both: 'otlp'
		});
		expect(probe.state.traceProvider).toBe('otlp');
		expect(probe.state.sentryEnabled).toBe(true);
		expect(probe.recording).toBe(true);
		expect(probe.skipOpenTelemetrySetup).toBe(true);
		expect(probe.tracesSampleRate).toBeNull();
		expect(probe.traceProviderInstalled).toBe(false);
		expect(probe.enableLogs).toBe(true);
		expect(probe.names).toContain('Pino');
		expect(probe.names).not.toContain('Prisma');
	});

	test('a DSN alone keeps Sentry tracing and the shared OpenTelemetry span', () => {
		const { status, stderr, probe } = runProbe(selectionScript, {
			SENTRY_DSN: dsn,
			NODE_ENV: 'development'
		});

		expect(status, stderr).toBe(0);
		expect(probe.state).toEqual({
			traceProvider: 'sentry',
			sentryEnabled: true
		});
		expect(probe.recording).toBe(true);
		expect(probe.skipOpenTelemetrySetup).toBeNull();
		expect(probe.tracesSampleRate).toBe(1);
		expect(probe.traceProviderInstalled).toBe(true);
		expect(probe.names).toEqual(expect.arrayContaining(['Pino', 'Http', 'Prisma']));
		expect(probe.shared.same).toBe(true);
		expect(probe.shared.otelId).toMatch(/^[0-9a-f]{32}$/);
	});

	test('production Sentry mode keeps the 0.1 sample rate', () => {
		const { status, stderr, probe } = runProbe(selectionScript, {
			SENTRY_DSN: dsn,
			NODE_ENV: 'production'
		});

		expect(status, stderr).toBe(0);
		expect(probe.state.traceProvider).toBe('sentry');
		expect(probe.tracesSampleRate).toBe(0.1);
	});

	test('neither DSN nor endpoint registers a provider', () => {
		const { status, stderr, probe } = runProbe(selectionScript, {
			NODE_ENV: 'development'
		});

		expect(status, stderr).toBe(0);
		expect(probe.state).toEqual({
			traceProvider: 'none',
			sentryEnabled: false
		});
		expect(probe.recording).toBe(false);
		expect(probe.names).toEqual([]);
		expect(probe.shared).toBeNull();
	});
});

describe('in-memory span export', () => {
	test('tracer and instrument export real parented spans under Bun', () => {
		const { status, stderr, probe } = runProbe(memoryScript, {
			NODE_ENV: 'production'
		});

		expect(status, stderr).toBe(0);
		expect(probe.thrown).toBe('boom');

		const spans = probe.spans as Array<{
			name: string;
			spanId: string;
			parent: string | null;
			status: number;
			attributes: Record<string, string>;
			service: string;
			exceptions: number;
		}>;
		const request = spans.find(span => span.name === 'request');
		const created = spans.find(span => span.name === 'order.create');
		const paystack = spans.find(span => span.name === 'external.paystack');
		const failed = spans.find(span => span.name === 'order.fail');

		expect(request?.service).toBe('habiti-api');
		expect(created?.parent).toBe(request?.spanId);
		expect(created?.status).toBe(1);
		expect(created?.attributes.status).toBe('pending');
		expect(paystack?.parent).toBe(created?.spanId);
		expect(paystack?.status).toBe(1);
		expect(paystack?.attributes).toEqual({ op: 'charge', target: 'paystack' });
		expect(failed?.parent).toBe(request?.spanId);
		expect(failed?.status).toBe(2);
		expect(failed?.exceptions).toBe(1);
	});
});

describe('boot without a telemetry backend', () => {
	test('a request still logs request_finished', () => {
		const { status, stdout, stderr, probe } = runProbe(bootScript, {
			NODE_ENV: 'production',
			LOG_LEVEL: 'info',
			LOOPS_API_KEY: 'test'
		});

		expect(status, stderr).toBe(0);
		expect(probe.status).toBe(200);
		expect(probe.state).toEqual({
			traceProvider: 'none',
			sentryEnabled: false
		});
		expect(probe.traceparent).toMatch(
			/^[0-9a-f]{2}-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/i
		);
		expect(stdout).toContain('request_finished');
		expect(stdout).toContain('"status":200');
	});
});

describe('OTLP HTTP export', () => {
	test('a finished span is posted to the configured endpoint', async () => {
		const hits: {
			path: string;
			body: string;
			contentType: string | null;
			authorization: string | null;
		}[] = [];
		const server = Bun.serve({
			port: 0,
			hostname: '127.0.0.1',
			async fetch(req) {
				hits.push({
					path: new URL(req.url).pathname,
					body: await req.text(),
					contentType: req.headers.get('content-type'),
					authorization: req.headers.get('authorization')
				});
				return new Response(null, { status: 200 });
			}
		});

		const env: Record<string, string> = {};

		for (const [key, value] of Object.entries({
			...process.env,
			...requiredEnv,
			SENTRY_DSN: undefined,
			NODE_ENV: 'development',
			OTEL_EXPORTER_OTLP_ENDPOINT: `http://127.0.0.1:${server.port}`,
			OTEL_EXPORTER_OTLP_HEADERS: 'Authorization=Bearer%20test-token'
		})) {
			if (typeof value === 'string') env[key] = value;
		}

		try {
			const proc = Bun.spawn([process.execPath, '-e', listenerChild], {
				cwd: apiRoot,
				env,
				stdout: 'pipe',
				stderr: 'pipe'
			});
			const stdout = await new Response(proc.stdout).text();
			const stderr = await new Response(proc.stderr).text();
			const status = await proc.exited;
			const probeLine = stderr
				.split('\n')
				.reverse()
				.find(line => line.startsWith('PROBE '));
			const probe = probeLine
				? JSON.parse(probeLine.slice('PROBE '.length))
				: null;

			expect(status, stderr + stdout).toBe(0);
			expect(probe.state.traceProvider).toBe('otlp');
			expect(probe.traceId).toMatch(/^[0-9a-f]{32}$/);
			expect(hits).toHaveLength(1);
			expect(hits[0]?.path).toBe('/v1/traces');
			expect(hits[0]?.contentType).toContain('application/json');
			expect(hits[0]?.authorization).toBe('Bearer test-token');
			expect(hits[0]?.body).toContain('order.create');
			expect(hits[0]?.body).toContain('habiti-api');
			expect(hits[0]?.body).toContain(probe.traceId);
		} finally {
			server.stop(true);
		}
	}, 15_000);
});
