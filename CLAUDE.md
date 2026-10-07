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

## Common Development Commands

```bash
# Setup
bun i && bun i --cwd api # Install all dependencies
bun start:redis          # Start Redis (required for API)

# Development
bun dev:api              # Backend dev server
bun start:app            # Consumer app dev server
bun start:dashboard      # Dashboard dev server
bun dev:web              # Consumer web dev server
bun dev:admin            # Admin panel dev server
```

### Database Operations

```bash
cd api && npx prisma generate   # Generate Prisma client
cd api && npx prisma db push    # Push schema changes
cd api && npx prisma migrate dev  # Create new migration
```

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
├── scripts/               # Repo-level maintenance scripts (bank list, screenshots)
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
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── core/              # Domain layer
│   │   ├── data/          # Prisma access, one module per entity
│   │   ├── logic/         # Business logic, orchestrates data modules
│   │   ├── payments/      # Paystack client, types and payload validation
│   │   ├── validations/   # Request/response schemas
│   │   └── notifications.ts  # Push notification helpers
│   ├── routes/            # Hono route handlers, mounted in routes/index.ts
│   ├── middleware/        # Auth, context, error handling, rate limiting, logging
│   ├── services/          # Cross-cutting services (logger, email, analytics, metrics, tracing)
│   ├── config/            # Client/env setup (Prisma, Redis, Sentry, Cloudinary, env)
│   ├── scripts/           # Operational scripts (backfills, reconciliation, pruning)
│   ├── generated/         # Generated Prisma client, do not edit
│   ├── test/              # Test helpers and fakes
│   ├── types/             # Shared types (Hono env bindings)
│   ├── utils/             # Helpers (currency, queries, uploads, polling, CORS)
│   ├── app.ts             # Builds the Hono app with injectable dependencies
│   ├── dependencies.ts    # Dependency container (Prisma, Redis, services, tracer)
│   ├── index.ts           # Server entry point
│   └── lifecycle.ts       # Graceful shutdown stages and process safety nets
└── package.json
```

### Philosophy

- Modularity: Avoid tangling separate concerns too tightly. This however, is not a recommendation of extreme OOP (particularly inheritance). Make features composable and independently testable.
- Files over folders: Avoid creating new files for everything. Scope related functions in the same file, especially when they are not imported elsewhere. For example, screen files should contain everything that is needed to render the screen, except components that are reused elsewhere.
- Comments: Avoid plastering comments everywhere and on everything. Only use comments when behaviour is potentially unclear or tricky.
