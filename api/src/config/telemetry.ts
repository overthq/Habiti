import { context, propagation, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { parseKeyPairsIntoRecord, W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
	BasicTracerProvider,
	BatchSpanProcessor,
	ParentBasedSampler,
	TraceIdRatioBasedSampler
} from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import * as Sentry from '@sentry/bun';

import { env } from './env';

/**
 * The only module that registers a tracer provider. `config/sentry.ts` calls
 * `startTelemetry` before `Sentry.init`.
 *
 * One `BasicTracerProvider` is always registered. Sampling is
 * `ParentBasedSampler` around `TraceIdRatioBasedSampler`: 0.1 in production,
 * 1 otherwise. `Sentry.init` does not set `tracesSampleRate` or
 * `tracesSampler`.
 *
 * Exporter precedence, one destination:
 * - `OTEL_EXPORTER_OTLP_ENDPOINT` → OTLP/HTTP traces, even when `SENTRY_DSN`
 *   is also set. Sentry then receives errors and logs only.
 * - only `SENTRY_DSN` → the same OTLP/HTTP exporter pointed at
 *   `Sentry.getOtlpTracesEndpoint()`. `@sentry/bun` 11 exports that helper;
 *   there is no second provider and no `SentrySpanProcessor`.
 * - neither → the provider stays registered with no exporter. Spans record
 *   locally and are dropped. Stdout logs are unchanged.
 */
let provider: BasicTracerProvider | undefined;
let sentryEnabled = false;
let shuttingDown: Promise<void> | undefined;
let started = false;

const tracesUrl = (endpoint: string): string => {
	let parsed: URL;

	try {
		parsed = new URL(endpoint);
	} catch {
		throw new Error(
			`OTEL_EXPORTER_OTLP_ENDPOINT is not a valid URL: ${endpoint}`
		);
	}

	const path = parsed.pathname.replace(/\/$/, '');

	if (path.endsWith('/v1/traces')) return parsed.toString();

	parsed.pathname = path && path !== '/' ? `${path}/v1/traces` : '/v1/traces';

	return parsed.toString();
};

const sampleRate = (): number => (env.NODE_ENV === 'production' ? 0.1 : 1);

const otlpProcessor = (endpoint: string): BatchSpanProcessor => {
	const headers = parseKeyPairsIntoRecord(env.OTEL_EXPORTER_OTLP_HEADERS);

	return new BatchSpanProcessor(
		new OTLPTraceExporter({
			url: tracesUrl(endpoint),
			...(Object.keys(headers).length > 0 ? { headers } : {})
		})
	);
};

const sentryProcessor = (dsn: string): BatchSpanProcessor | undefined => {
	const endpoint = Sentry.getOtlpTracesEndpoint(dsn);
	if (!endpoint) return undefined;

	return new BatchSpanProcessor(new OTLPTraceExporter(endpoint));
};

export const startTelemetry = (initSentry: () => boolean): void => {
	if (started) return;
	started = true;

	const endpoint = env.OTEL_EXPORTER_OTLP_ENDPOINT;
	const dsn = env.SENTRY_DSN;
	const exporter = endpoint
		? otlpProcessor(endpoint)
		: dsn
			? sentryProcessor(dsn)
			: undefined;

	provider = new BasicTracerProvider({
		sampler: new ParentBasedSampler({
			root: new TraceIdRatioBasedSampler(sampleRate())
		}),
		resource: resourceFromAttributes({
			[ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME
		}),
		...(exporter ? { spanProcessors: [exporter] } : {})
	});

	const contextManager = new AsyncLocalStorageContextManager().enable();

	if (!context.setGlobalContextManager(contextManager)) {
		throw new Error('OpenTelemetry context manager is already registered');
	}

	if (!propagation.setGlobalPropagator(new W3CTraceContextPropagator())) {
		throw new Error('OpenTelemetry propagator is already registered');
	}

	if (!trace.setGlobalTracerProvider(provider)) {
		throw new Error('OpenTelemetry tracer provider is already registered');
	}

	sentryEnabled = initSentry();
};

/** Flush the provider and close Sentry. */
export const shutdownTelemetry = (): Promise<void> => {
	if (shuttingDown) return shuttingDown;

	shuttingDown = (async () => {
		const tasks: Promise<unknown>[] = [];

		const active = provider;
		provider = undefined;

		if (active) {
			tasks.push(active.forceFlush().then(() => active.shutdown()));
		}

		if (sentryEnabled) {
			tasks.push(Sentry.close(2_000));
			sentryEnabled = false;
		}

		await Promise.all(tasks);
	})();

	return shuttingDown;
};
