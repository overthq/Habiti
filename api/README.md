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

`bun dev:api` prints pretty, single-line logs when `LOG_FORMAT` is unset and `NODE_ENV` is anything other than `production` (including when `NODE_ENV` itself is unset). `LOG_FORMAT` is `json` or `pretty`. It is optional and has no default: set `LOG_FORMAT=json` or `LOG_FORMAT=pretty` to choose the transport directly.

Deployed environments must set `NODE_ENV=production` themselves. The env schema leaves `NODE_ENV` unset when the variable is absent, so a missing value stays on the non-production path: pretty logs (unless `LOG_FORMAT` overrides that), Prisma slow-query SQL and params, Sentry trace sampling at 1.0, the dev OTP log, and production-only routes that do not require auth.

`LOG_LEVEL` is `trace`, `debug`, `info`, `warn`, `error`, or `fatal` (default `info`). `trace` logs every Prisma query, so use it only briefly.

Grep the stream by event name (`request_finished`, `db.slow_query`, and so on). Each response sets `x-request-id`; that value is `requestId` on every line for the request. `userId` and `storeId` are only on `request_finished`. That line also includes `route` (the route template, same value as the HTTP metrics).

To pipe JSON through `jq` locally:

```sh
cd api && LOG_FORMAT=json LOG_LEVEL=info bun --watch src/index.ts 2>&1 | jq -c 'select(.msg=="request_finished")'
```

`LOG_FORMAT=json` only switches the log transport. Setting `NODE_ENV=production` to get JSON also drops Sentry trace sampling to 0.1, hides slow-query SQL and params, turns off the dev OTP log, and requires auth on production-only routes. Day to day, read the pretty dev output instead.
