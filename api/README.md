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

## Tracing

Sentry is the trace backend. When `SENTRY_DSN` is set, `@sentry/bun` records a span for each `Bun.serve` request, Prisma spans through `prismaIntegration`, and outbound HTTP spans through `httpIntegration`. The same init registers `pinoIntegration`, which forwards Pino logs by subscribing to Pino's tracing channel. It is not a Pino transport, so production logging stays on sync stdout. Structured fields on the line (`requestId`, `traceId`, `userId`, `storeId`, and the rest of the JSON) are sent as Sentry log attributes. A log emitted while a Sentry span is active carries that span's trace id on the Sentry log (`trace_id`), so the log lines up with the trace. Nothing registers an OpenTelemetry SDK or reads `OTEL_EXPORTER_OTLP_ENDPOINT`. `OTEL_SERVICE_NAME` is only the `service` field on log lines (default `habiti-api`).

`traceId` on a request log is the active Sentry span's trace id when that span exists, and the response `traceparent` uses the same id. That is the id on the Sentry trace. Sentry continues an inbound `sentry-trace` / `baggage` pair. It does not continue an inbound W3C `traceparent`, so a caller-supplied `traceparent` is not the Sentry trace id while a Sentry span is active.

There is no active Sentry span when `SENTRY_DSN` is unset, when the handler runs through `app.fetch` outside `Bun.serve`, or for `OPTIONS` and `HEAD` (the Bun server integration skips those methods). `logsMiddleware` then keeps the inbound `traceparent` or mints one, and the response echoes that header when the middleware runs. CORS may answer `OPTIONS` before the middleware. The error handler copies the log id into Sentry event context as `request.traceId`. That context field matches Sentry's own trace id only when a span was active for the request.

`tracer.startSpan` (orders, Paystack webhooks) only runs the wrapped function. It does not emit a span. `utils/instrument.ts` still records `external.call.duration_ms` and `external.call.errors` for Paystack, Cloudinary, and Loops.
