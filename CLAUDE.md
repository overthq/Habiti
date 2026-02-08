# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Habiti is an open-source mobile-first e-commerce platform for small-to-medium retailers in Nigeria. It's a TypeScript monorepo with 4 main applications: a consumer mobile app, merchant dashboard app, web interface, and admin panel.

## Common Development Commands

### Setup and Installation

```bash
# Install all dependencies
bun i && bun i --cwd api

# Start Redis (required for API)
bun start-redis

# Start mobile apps
bun start:app        # Consumer app
bun start:dashboard  # Merchant dashboard
```

### Individual Application Commands

```bash
# API (GraphQL + REST)
cd api && bun dev              # Development server
cd api && bun build && bun start  # Production build

# Mobile Apps (React Native + Expo)
cd apps/app && bun start       # Consumer app dev server
cd apps/dashboard && bun start # Dashboard dev server
cd apps/app && bun generate-types  # Generate GraphQL types

# Web (Next.js)
cd apps/web && bun dev --turbopack  # Development with Turbopack
cd apps/web && bun run build && bun start  # Production

# Admin (React Router)
cd apps/admin && bun dev       # Development
cd apps/admin && bun run build && bun start  # Production
```

### Database Operations

```bash
cd api && npx prisma generate   # Generate Prisma client
cd api && npx prisma db push    # Push schema changes
cd api && npx prisma migrate dev  # Create new migration
cd api && npx prisma studio     # Database GUI
```

## Architecture Overview

### Monorepo Structure

- `api/` - GraphQL API with Express, Prisma, PostgreSQL, Redis
- `apps/app/` - Consumer mobile app (React Native + Expo)
- `apps/dashboard/` - Merchant mobile app (React Native + Expo)
- `apps/web/` - Web frontend (Next.js + Tailwind)
- `apps/admin/` - Admin panel (React Router + Tailwind)
- `packages/` - Shared code (utilities, components)

### Key Technologies

- **Backend**: Node.js, Express, Apollo GraphQL, Prisma, PostgreSQL, Redis
- **Mobile**: React Native 0.79.2, Expo 53, React 19
- **Web**: Next.js 15.2.4, React Router 7, Tailwind CSS
- **State**: Zustand
- **Auth**: JWT tokens with express-jwt middleware
- **Storage**: Cloudinary for images/media
- **Monitoring**: Sentry, PostHog analytics
- **Payments**: Paystack integration

### Multi-Tenant Architecture

- Store-scoped data access via `x-market-store-id` header
- Store managers can only access their assigned stores
- Separate admin entity with elevated permissions
- All GraphQL context includes current user and store scope

### Database Design

Core entities: User, Store, Product, Order, Cart with comprehensive relationships:

- Multi-tenant stores with manager permissions
- Products with categories, options, reviews, inventory tracking
- Full order lifecycle with payment integration
- Revenue tracking (realized/unrealized/paidOut)
- Push notifications across multiple devices

### API Patterns

- **Primary**: GraphQL for complex queries and mutations
- **REST**: Webhooks (`/webhooks`), payments (`/payments`), health checks (`/health`)
- **Authentication**: JWT-based with optional auth support
- **Authorization**: Role-based access control with store-scoped permissions

### Code Generation

All frontend apps use GraphQL code generation:

```bash
# Generate types from GraphQL schema
bun generate-types  # In any app directory
```

### Development Workflow

1. Start Redis and PostgreSQL
2. Run API in development mode
3. Start desired frontend app(s)
4. Use Prisma Studio for database inspection
5. Generate GraphQL types after schema changes

### Multi-Platform Support

- **iOS/Android**: React Native apps via Expo
- **Web**: Next.js with responsive design
- **Admin**: React Router SPA for platform administration

The platform serves the Nigerian retail market with features like multi-store following, inventory management, order tracking, and payment processing through Paystack.
