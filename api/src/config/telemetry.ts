import { context, propagation, trace } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
	BasicTracerProvider,
	BatchSpanProcessor,
	ParentBasedSampler,
	TraceIdRatioBasedSampler
} from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import {
	PrismaInstrumentation,
	registerInstrumentations
} from '@prisma/instrumentation';
import * as Sentry from '@sentry/bun';

import { env } from './env';

// Traces export to OTEL_EXPORTER_OTLP_ENDPOINT when it is set (the exporter
// reads that and OTEL_EXPORTER_OTLP_HEADERS itself), otherwise to Sentry's
// OTLP endpoint when SENTRY_DSN is set. With neither, spans are dropped.
const sentryOtlp = env.SENTRY_DSN
	? Sentry.getOtlpTracesEndpoint(env.SENTRY_DSN)
	: undefined;

const exporter = env.OTEL_EXPORTER_OTLP_ENDPOINT
	? new OTLPTraceExporter()
	: sentryOtlp
		? new OTLPTraceExporter(sentryOtlp)
		: undefined;

const provider = new BasicTracerProvider({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME
	}),
	sampler: new ParentBasedSampler({
		root: new TraceIdRatioBasedSampler(env.NODE_ENV === 'production' ? 0.1 : 1)
	}),
	spanProcessors: exporter ? [new BatchSpanProcessor(exporter)] : []
});

context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());
propagation.setGlobalPropagator(new W3CTraceContextPropagator());
trace.setGlobalTracerProvider(provider);
registerInstrumentations({ instrumentations: [new PrismaInstrumentation()] });

export const shutdownTelemetry = async () => {
	await provider.forceFlush();
	await provider.shutdown();
};
