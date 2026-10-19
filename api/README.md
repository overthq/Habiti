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

Application spans go through the OpenTelemetry API (`tracer.startSpan`, `instrument`). Importing `src/config/sentry.ts` boots telemetry: `src/config/telemetry.ts` registers one `BasicTracerProvider` before `Sentry.init`. The provider uses `AsyncLocalStorageContextManager`, `W3CTraceContextPropagator`, and `service.name` from `OTEL_SERVICE_NAME` (default `habiti-api`). Sampling is a parent-based trace-id ratio: `1` outside production and `0.1` in production. Switching where spans are exported is environment configuration.

**Exporter precedence.** One destination.

- `OTEL_EXPORTER_OTLP_ENDPOINT` set: OTLP/HTTP traces to that base URL, with `/v1/traces` appended when it is not already there. `OTEL_EXPORTER_OTLP_HEADERS` is an optional comma-separated `key=value` list (percent-encode values). Traces go there only, even when `SENTRY_DSN` is also set. Any OTLP/HTTP collector works: Grafana, Axiom, Honeycomb, or PostHog's OTLP traces endpoint.
- Only `SENTRY_DSN` set: the same OTLP/HTTP exporter, pointed at `Sentry.getOtlpTracesEndpoint()` (`@sentry/bun` 11). That is Sentry's OTLP traces URL and `X-Sentry-Auth` header. There is no `SentrySpanProcessor` and Sentry does not register a second provider.
- Neither set: the provider is still registered, with no exporter. Spans record locally and are dropped. Stdout logs are unchanged and Sentry stays off.

**Sentry** (`@sentry/bun` 11) starts after the provider, and only when `SENTRY_DSN` is set. `enableOpenTelemetrySetup` is `false`, so Sentry does not install its own tracer provider. `tracesSampleRate` and `tracesSampler` are left unset. `openTelemetryIntegration` attaches Sentry errors, logs, metrics, and check-ins to the active OpenTelemetry span. `pinoIntegration` still forwards Pino `info` and above by subscribing to Pino's tracing channel. It is not a Pino transport, so production logging stays on sync stdout. Structured fields on the line (`requestId`, `traceId`, `userId`, `storeId`, and the rest of the JSON) are sent as Sentry log attributes. A log emitted while a span is active carries that span's trace id on the Sentry log (`trace_id`). `beforeSend` still drops `LogicError` and HTTP status below 500.

**Span coverage.** The previous Sentry-owned provider recorded a `Bun.serve` span per request, Prisma spans, and outbound HTTP spans. Those integrations emit Sentry spans, and SDK 11 does not feed Sentry spans into a provider the app registered. With sample rates unset they are not recorded. Nothing in the installed dependencies is a Bun-compatible OpenTelemetry instrumentation for `Bun.serve`, Prisma, or outbound HTTP, so those automatic spans are gone. Spans that export are the ones the app starts through `@opentelemetry/api`: `tracer.startSpan` (`order.create`, `paystack.webhook`, and the other call sites) and `instrument` (`external.${name}`).

**Logs.** Stdout is unchanged: pretty lines when `NODE_ENV` is unset, JSON when `NODE_ENV=production`. There is no OTLP log exporter. A collector scrapes or forwards stdout. `pinoIntegration` is only the Sentry log adapter, and only when Sentry itself is initialised. Scripts do not import the telemetry bootstrap, so their lines stay on stdout and Sentry stays off.

**Correlation.** `traceId` on a request log is the active OpenTelemetry span's trace id when that span exists, and the response `traceparent` uses the same id. Propagation on the provider is W3C `traceparent`. `logsMiddleware` keeps an inbound `traceparent` or mints one when no usable span is active, and the response echoes that header when the middleware runs. CORS may answer `OPTIONS` before the middleware. The error handler copies the log id into the reported event as `request.traceId`.

`utils/instrument.ts` still records `external.call.duration_ms` and `external.call.errors` for Paystack, Cloudinary, and Loops, and wraps the call in the `external.${name}` span.

Shutdown force-flushes and shuts down the provider, and closes Sentry when it was initialised.
