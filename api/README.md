# Habiti API

This package contains the code for the API that powers Habiti. It consists of all API routes, database and cache bindings, as well storage and file upload functions.

## Installation and Setup

From the root directory, run the following commands:

```sh
bun i --cwd api
bun start-redis # Only necessary if Redis isn't running in the background.
bun dev:api
```

## Reading logs

`bun dev:api` (with `NODE_ENV` unset) prints pretty, single-line logs. `NODE_ENV=production` prints JSON to stdout.

When `SENTRY_DSN` is set, Pino lines at `info`, `warn`, `error`, and `fatal` are also sent to Sentry Logs. `trace` and `debug` are not. Pino applies `LOG_LEVEL` first, so a debug line emitted while `LOG_LEVEL=info` never reaches Sentry. Scripts do not initialize Sentry, so their lines stay on stdout.

Grep the stream by event name (`request_finished`, `db.slow_query`, and so on). Each response sets `x-request-id`; that value is `requestId` on every line for the request. After auth resolves, every later line carries the ids known for that request: `userId` when the access token is valid, and `storeId` when the token has a store claim or an optional-auth request with no token sends `x-market-store-id`. Lines from before auth, and requests that never authenticate, do not carry those ids. `request_finished` still includes `userId` and `storeId` when the request ended with them set, and includes `route` (the route template, same value as the HTTP metrics).

## Telemetry backend

Application spans go through the OpenTelemetry API (`tracer.startSpan`, `instrument`). `src/config/telemetry.ts` is the only module that registers a provider. Switching the trace exporter is environment configuration.

**Precedence.** `OTEL_EXPORTER_OTLP_ENDPOINT` wins, including when `SENTRY_DSN` is also set. Traces then have one exporter. With only a DSN, Sentry is the trace backend. With neither, no SDK is registered and span calls no-op.

**Sentry traces** (DSN set, endpoint unset). This is the default. `@sentry/bun` records a span for each `Bun.serve` request, Prisma spans through `prismaIntegration`, and outbound HTTP spans through `httpIntegration`. `tracesSampleRate` is `0.1` in production and `1` otherwise. The same init registers `pinoIntegration`, which forwards Pino logs by subscribing to Pino's tracing channel. It is not a Pino transport, so production logging stays on sync stdout. Structured fields on the line (`requestId`, `traceId`, `userId`, `storeId`, and the rest of the JSON) are sent as Sentry log attributes. A log emitted while a Sentry span is active carries that span's trace id on the Sentry log (`trace_id`). Sentry registers the global OpenTelemetry provider, so `trace.getActiveSpan()` sees those spans.

**OTLP traces** (endpoint set). `BasicTracerProvider` exports OTLP/HTTP to that base URL with `/v1/traces` appended. `OTEL_EXPORTER_OTLP_HEADERS` is an optional comma-separated `key=value` list (percent-encode values). `OTEL_SERVICE_NAME` is the resource `service.name` (default `habiti-api`) and the `service` field on log lines. Sampling follows `OTEL_TRACES_SAMPLER` (the SDK default is parent-based always-on). Any OTLP/HTTP collector works: Grafana, Axiom, Honeycomb, or PostHog's OTLP traces endpoint. There is no `Bun.serve` auto-instrumentation on this path. `tracer.startSpan` (`order.create`, `paystack.webhook`, and the other call sites) and `instrument` (`external.${name}`) are the spans that export.

When the DSN is also set, Sentry still receives errors and Pino logs. It is initialised with `skipOpenTelemetrySetup: true` and without `tracesSampleRate`, so it does not register a second tracer provider and it does not install `SentrySpanProcessor`. Error grouping stays Sentry-shaped. Sentry issues are not a stand-in for the OTLP trace backend.

**Logs.** Stdout is unchanged: pretty lines when `NODE_ENV` is unset, JSON when `NODE_ENV=production`. There is no OTLP log exporter. In OTLP mode a collector scrapes or forwards stdout. `pinoIntegration` is only the Sentry log adapter, and only when Sentry itself is initialised. Scripts do not import the telemetry bootstrap, so their lines stay on stdout and Sentry stays off.

**Correlation.** `traceId` on a request log is the active OpenTelemetry span's trace id when that span exists, and the response `traceparent` uses the same id. In Sentry trace mode that is the Sentry trace id. Sentry continues an inbound `sentry-trace` / `baggage` pair. It does not continue an inbound W3C `traceparent`, so a caller-supplied `traceparent` is not the Sentry trace id while a Sentry span is active.

There is no active span when no provider is registered, when the handler runs through `app.fetch` outside `Bun.serve` in Sentry mode, or for `OPTIONS` and `HEAD` (the Bun server integration skips those methods). `logsMiddleware` then keeps the inbound `traceparent` or mints one, and the response echoes that header when the middleware runs. CORS may answer `OPTIONS` before the middleware. The error handler copies the log id into the reported event as `request.traceId`.

`utils/instrument.ts` still records `external.call.duration_ms` and `external.call.errors` for Paystack, Cloudinary, and Loops, and wraps the call in the `external.${name}` span.

Shutdown flushes the OTLP provider, when one was registered, and closes Sentry.
