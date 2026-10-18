# Habiti API

This package contains the code for the API that powers Habiti. It consists of all API routes, database and cache bindings, as well storage and file upload functions.

## Installation and Setup

From the root directory, run the following commands:

```sh
bun i --cwd api
bun start-redis # Only necessary if Redis isn't running in the background.
bun dev:api
```

## Tracing

Sentry is the trace backend. When `SENTRY_DSN` is set, `@sentry/bun` records a span for each `Bun.serve` request, Prisma spans through `prismaIntegration`, and outbound HTTP spans through `httpIntegration`. Nothing registers an OpenTelemetry SDK or reads `OTEL_EXPORTER_OTLP_ENDPOINT`. `OTEL_SERVICE_NAME` is only the `service` field on log lines (default `habiti-api`).

`traceId` on a request log is the active Sentry span's trace id when that span exists, and the response `traceparent` uses the same id. That is the id on the Sentry trace. Sentry continues an inbound `sentry-trace` / `baggage` pair. It does not continue an inbound W3C `traceparent`, so a caller-supplied `traceparent` is not the Sentry trace id while a Sentry span is active.

There is no active Sentry span when `SENTRY_DSN` is unset, when the handler runs through `app.fetch` outside `Bun.serve`, or for `OPTIONS` and `HEAD` (the Bun server integration skips those methods). `logsMiddleware` then keeps the inbound `traceparent` or mints one, and the response echoes that header when the middleware runs. CORS may answer `OPTIONS` before the middleware. The error handler copies the log id into Sentry event context as `request.traceId`. That context field matches Sentry's own trace id only when a span was active for the request.

`tracer.startSpan` (orders, Paystack webhooks) only runs the wrapped function. It does not emit a span. `utils/instrument.ts` still records `external.call.duration_ms` and `external.call.errors` for Paystack, Cloudinary, and Loops.
