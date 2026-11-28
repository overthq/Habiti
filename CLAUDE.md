# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Habiti is an open-source mobile-first e-commerce platform for small-to-medium retailers in Nigeria. It's a TypeScript monorepo with 4 main applications: a consumer mobile app, merchant dashboard app, web interface, and admin panel.

**Tech Stack:**

- Mobile apps (consumer and dashboard)
  - React 19
  - React Native
  - React Navigation 7
  - Zustand
  - TanStack Query (React Query)

- Web apps (consumer and admin web)
  - React 19
  - TanStack Start / Router (file-based routing)
  - Tailwind CSS v4 with shadcn/ui (Radix)
  - TanStack Query (React Query)
  - Zustand
  - Deployed to Cloudflare Workers (Vite + Wrangler)

- Server
  - Bun
  - Hono
  - Prisma (with Postgres)
  - Redis

## Running the apps

```bash
bun setup            # Fresh checkout: deps, env files, databases, Playwright browser
bun stack            # Everything, in a Rex session called "Habiti", one tab per service
                     # Rerun to restart what is down; --only api,web or --no-mobile for a subset
bun stack --e2e      # The e2e stack ("Habiti E2E"), configured by the root .env.e2e
bun stack status     # What is up, on which port
bun stack logs api   # A service's output; pipe it to grep
bun stack down       # Close the session and everything in it
```

Ports in dev: API 4000, fake Paystack 4010, web 3000, admin 3001, Metro 8081 (app) and 8082 (dashboard). The single-service scripts (`bun dev:api`, `bun dev:web`, ...) still work for a terminal per service.

- Postgres and Redis run natively on localhost (Postgres.app or Homebrew). There is no Docker.
- Without Cloudinary keys, uploads are written to `api/.uploads` and served from `/files`. With `PAYSTACK_BASE_URL` pointed at the fake Paystack (`api/src/test/fake-paystack.ts`), payments, bank lookups and payouts work offline, webhooks included.
- Signing in: read the code with `bun stack logs api | grep devOtp` (add `--e2e` for the e2e stack). Test runners read it from Redis with `bun run --cwd api e2e otp <email>`.
- `bun run db:reset` wipes and reseeds the dev database. `bun setup` never wipes it.
- Run Prisma's CLI as `bunx --bun prisma ...` (e.g. `cd api && bunx --bun prisma migrate dev` for a schema change): under Node 22.9 it fails with `ERR_REQUIRE_ESM`.

## Testing

Most coverage is end-to-end: Playwright drives the consumer web app (`apps/web/e2e`) and Maestro drives the dashboard (`apps/dashboard/e2e`), against the e2e stack. Unit tests stay for logic with many edge cases that are slow to reach through a UI (ledger, payments, permissions, auth).

```bash
bun e2e:web          # Playwright; starts the e2e stack itself if it is not running
bun e2e:dashboard    # Maestro; needs `bun stack --e2e` and the dev client on a simulator
bun e2e:journey      # One order across the dashboard and web
cd api && bun test src
```

Tests build their state through `scenarios` in `api/src/test/factories.ts` and then act and assert only through the UI. Before writing, running or debugging an e2e test, or driving a running app to check a change, use the `e2e` skill.

## Architecture Overview

### Monorepo Structure

```
├── apps/
│   ├── app/               # Consumer mobile app (React Native + Expo)
│   ├── dashboard/         # Merchant mobile app (React Native + Expo)
│   ├── web/               # Consumer web app (TanStack Start + Tailwind)
│   └── admin/             # Admin panel (TanStack Start + Tailwind)
├── packages/
│   ├── components/        # Shared React Native UI components
│   └── common/            # Shared utilities (currency formatting)
├── scripts/               # Repo-level scripts (setup, Rex stack, bank list, screenshots)
├── e2e/                   # Cross-app journeys (dashboard + web)
└── api/                   # REST API with Hono, Prisma, PostgreSQL, Redis
```

#### Consumer mobile app structure

```
app/
├── src/
│   ├── components/        # Reusable components (shared across screens)
│   ├── screens/           # Screen components, one file per screen
│   ├── navigation/        # React Navigation routes and route types
│   ├── data/              # API client, queries, mutations and response types
│   ├── hooks/             # Shared hooks
│   ├── state/             # Zustand stores (auth, preferences, recently viewed)
│   └── utils/             # Helpers (dates, links, notifications, Paystack, Sentry)
├── App.tsx                # Root component: providers and navigation
└── index.ts               # Expo entry point
```

#### Dashboard mobile app structure

```
dashboard/
├── src/
│   ├── components/        # Reusable components (shared across screens)
│   ├── screens/           # Screen components, one file per screen
│   ├── navigation/        # React Navigation routes, sheets and route types
│   ├── modals/            # Modal/sheet content (filters, product editing)
│   ├── data/              # API client, queries, mutations and response types
│   ├── hooks/             # Shared hooks
│   ├── state/             # Zustand stores (auth, filters, preferences, sheets)
│   ├── types/             # Shared types (form shapes)
│   └── utils/             # Helpers (banks, dates, images, notifications, sharing)
├── App.tsx                # Root component: providers and navigation
└── index.ts               # Expo entry point
```

#### Web app structure

Both `apps/web` (consumer) and `apps/admin` follow the same layout, deployed to
Cloudflare Workers via Wrangler.

```
web/
├── src/
│   ├── routes/            # File-based TanStack Router routes
│   ├── components/        # Route-specific and shared UI (shadcn/ui + Radix)
│   ├── data/              # API client, queries, mutations and response types
│   ├── hooks/             # Shared hooks
│   ├── state/             # Zustand stores (web only)
│   ├── contexts/          # React contexts (web only, e.g. cart)
│   ├── integrations/      # Third-party setup (TanStack Query provider)
│   ├── lib/               # shadcn helpers, payments, polling
│   ├── utils/             # Formatting helpers
│   ├── router.tsx         # Router creation
│   └── routeTree.gen.ts   # Generated route tree, do not edit
└── vite.config.ts         # Vite + Cloudflare plugin config
```

#### Backend structure

```
api/
├── prisma/                   # Prisma schema and migrations
├── src/
│   ├── core/                 # Domain layer
│   │   ├── data/             # Prisma access, one module per entity
│   │   ├── logic/            # Business logic, orchestrates data modules
│   │   ├── payments/         # Paystack client, types and payload validation
│   │   ├── validations/      # Request/response schemas
│   │   └── notifications.ts  # Push notification helpers
│   ├── routes/               # Hono route handlers, mounted in routes/index.ts
│   ├── middleware/           # Auth, context, error handling, rate limiting, logging
│   ├── services/             # Cross-cutting services (logger, email, analytics, metrics, tracing)
│   ├── config/               # Client/env setup (Prisma, Redis, Sentry, Cloudinary, env)
│   ├── scripts/              # Operational scripts (backfills, reconciliation, pruning)
│   ├── generated/            # Generated Prisma client, do not edit
│   ├── test/                 # Test helpers and fakes
│   ├── types/                # Shared types (Hono env bindings)
│   ├── utils/                # Helpers (currency, queries, uploads, polling, CORS)
│   ├── app.ts                # Builds the Hono app with injectable dependencies
│   ├── dependencies.ts       # Dependency container (Prisma, Redis, services, tracer)
│   ├── index.ts              # Server entry point
│   └── lifecycle.ts          # Graceful shutdown stages and process safety nets
└── package.json
```

## Workflow
- Never stage changes, create a commit or push changes up automatically.

### Philosophy

- Modularity: Avoid tangling separate concerns too tightly. This however, is not a recommendation of extreme OOP (particularly inheritance). Make features composable and independently testable.
- Files over folders: Avoid creating new files for everything. Scope related functions in the same file, especially when they are not imported elsewhere. For example, screen files should contain everything that is needed to render the screen, except components that are reused elsewhere.
- Comments: names and structure carry the meaning. A comment records only what the code cannot show: a workaround for an external bug, a constraint imposed from outside, or why the obvious approach fails. Keep each one to a line or two. Usage and how-to text belongs in `--help` output, CLAUDE.md or a skill, never in a file header. Before reporting work as done, reread every comment in your diff and delete each one that a careful reader could reconstruct from the code.
- Justify the existence of a function: Don't just write helpers or utils for small issues.
- Keep functions large, until there is a reason to break it up. It is easier to read logic functions when all the moving parts are in plain sight.
