# Habiti API

This package contains the code for the API that powers Habiti. It consists of all API routes, database and cache bindings, as well storage and file upload functions.

## Installation and Setup

From the root directory, run the following commands:

```sh
bun i --cwd api
bun start-redis # Only necessary if Redis isn't running in the background.
bun dev:api
```

Scripts in `src/scripts` use this logger. They respect `LOG_LEVEL` and emit JSON when `NODE_ENV=production`, which is suitable for cron. `repair-store-balances` logs counts at info and one line per row at debug. Each replayed webhook gets its own `requestId`, the same field request logs carry.
