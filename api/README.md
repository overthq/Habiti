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

Run from `api/`. These are not on an in-process scheduler; run them from cron.

```sh
bun run expire-pending-payments
```

Cancels orders still in `PaymentPending` after Paystack Checkout's transfer window (30 minutes, plus a 5 minute grace) and restores their stock. Override the whole window in minutes with `PAYMENT_PENDING_EXPIRY_MINUTES`. When Redis is configured, the shopper gets the same order-cancelled push as a manual cancellation.
