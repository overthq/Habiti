import { context, propagation, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { parseKeyPairsIntoRecord, W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
	BasicTracerProvider,
	BatchSpanProcessor
} from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import * as Sentry from '@sentry/bun';

import { env } from './env';
import { initSentry } from './sentry';

/**
 * The only module that registers a trace provider.
 *
 * Precedence: `OTEL_EXPORTER_OTLP_ENDPOINT` wins, even when `SENTRY_DSN` is
 * also set. Traces then export once, over OTLP/HTTP, and Sentry is started
 * in errors/logs mode (`skipOpenTelemetrySetup`, no `tracesSampleRate`) so
 * it does not register a second provider. With only a DSN, Sentry keeps
 * today's tracing setup, including `tracesSampleRate` and `pinoIntegration`.
 * With neither, nothing is registered and the OpenTelemetry API no-ops.
 *
 * OTLP mode does not auto-instrument `Bun.serve`. Request logs still prefer
 * an active span and otherwise echo or mint `traceparent`. Logs stay on
 * stdout for a collector to scrape; there is no OTLP log exporter.
 * `pinoIntegration` remains the Sentry-mode log adapter only.
 */
export type TraceProviderName = 'otlp' | 'sentry' | 'none';

export const selectTraceProvider = (input: {
	otlpEndpoint?: string;
	sentryDsn?: string;
}): TraceProviderName => {
	if (input.otlpEndpoint) return 'otlp';
	if (input.sentryDsn) return 'sentry';
	return 'none';
};

export type TelemetryState = {
	traceProvider: TraceProviderName;
	sentryEnabled: boolean;
	otlpEndpoint?: string;
};

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

let otlpProvider: BasicTracerProvider | undefined;
let sentryEnabled = false;
let shuttingDown: Promise<void> | undefined;

const state: TelemetryState = {
	traceProvider: 'none',
	sentryEnabled: false
};

export const getTelemetryState = (): TelemetryState => ({ ...state });

const registerOtlp = (endpoint: string) => {
	const headers = parseKeyPairsIntoRecord(env.OTEL_EXPORTER_OTLP_HEADERS);
	const exporter = new OTLPTraceExporter({
		url: tracesUrl(endpoint),
		...(Object.keys(headers).length > 0 ? { headers } : {})
	});

	const provider = new BasicTracerProvider({
		resource: resourceFromAttributes({
			[ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME
		}),
		spanProcessors: [new BatchSpanProcessor(exporter)]
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

	otlpProvider = provider;
};

const bootstrap = () => {
	const endpoint = env.OTEL_EXPORTER_OTLP_ENDPOINT;
	const dsn = env.SENTRY_DSN;
	const traceProvider = selectTraceProvider({
		...(endpoint ? { otlpEndpoint: endpoint } : {}),
		...(dsn ? { sentryDsn: dsn } : {})
	});

	state.traceProvider = traceProvider;

	if (traceProvider === 'otlp' && endpoint) {
		registerOtlp(endpoint);
		state.otlpEndpoint = endpoint;
		sentryEnabled = initSentry('errors');
		state.sentryEnabled = sentryEnabled;
		return;
	}

	if (traceProvider === 'sentry') {
		sentryEnabled = initSentry('traces');
		state.sentryEnabled = sentryEnabled;
	}
};

bootstrap();

/** Flush the OTLP provider, when one was registered, and close Sentry. */
export const shutdownTelemetry = (): Promise<void> => {
	if (shuttingDown) return shuttingDown;

	shuttingDown = (async () => {
		const tasks: Promise<unknown>[] = [];

		if (otlpProvider) {
			tasks.push(otlpProvider.shutdown());
			otlpProvider = undefined;
		}

		if (sentryEnabled) {
			tasks.push(Sentry.close(2_000));
			sentryEnabled = false;
			state.sentryEnabled = false;
		}

		await Promise.all(tasks);
	})();

	return shuttingDown;
};
