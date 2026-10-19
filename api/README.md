# Habiti API

This package contains the code for the API that powers Habiti. It consists of all API routes, database and cache bindings, as well storage and file upload functions.

## Installation and Setup

From the root directory, run the following commands:

```sh
bun i --cwd api
bun start-redis # Only necessary if Redis isn't running in the background.
bun dev:api
```

## Operational scripts

Run from `api/`, on cron. Nothing schedules these in-process.

- `bun run expire-pending-payments`: every few minutes. Cancels orders still in `PaymentPending` after 35 minutes (`PAYMENT_PENDING_EXPIRY_MINUTES`), restores their stock and notifies the shopper.

## Tracing

`src/config/telemetry.ts` registers an OpenTelemetry tracer provider at startup. Each request gets a server span (continuing an inbound W3C `traceparent`), and `tracer.startSpan` and `instrument` add child spans. The request's `traceId` on log lines and the response `traceparent` come from that span.

Spans export over OTLP/HTTP to `OTEL_EXPORTER_OTLP_ENDPOINT` when it is set, otherwise to Sentry when `SENTRY_DSN` is set. With neither, they are dropped. Sampling is 10% in production and 100% elsewhere. Sentry handles error reporting and attaches errors to the active span; it does not run its own tracing.

When `SENTRY_DSN` is set, Pino lines at `info` and above (after `LOG_LEVEL` filtering) are also sent to Sentry Logs, with their structured fields as attributes and the active span's trace id. Stdout logging is unchanged.
