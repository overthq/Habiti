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
cd api && bun dev              # Development server
cd api && bun build && bun start  # Production build

# Mobile Apps (React Native + Expo)
cd apps/app && bun start       # Consumer app dev server
cd apps/dashboard && bun start # Dashboard dev server

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

- `api/` - REST API with Express, Prisma, PostgreSQL, Redis
- `apps/app/` - Consumer mobile app (React Native + Expo)
- `apps/dashboard/` - Merchant mobile app (React Native + Expo)
- `apps/web/` - Web frontend (Next.js + Tailwind)
- `apps/admin/` - Admin panel (React Router + Tailwind)
- `packages/` - Shared code (utilities, components)

### Key Technologies

- **Backend**: Node.js, Express, Prisma, PostgreSQL, Redis
- **Mobile**: React Native, Expo 55, React 19
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

### Database Design

Core entities: User, Store, Product, Order, Cart with comprehensive relationships:

- Multi-tenant stores with manager permissions
- Products with categories, options, reviews, inventory tracking
- Full order lifecycle with payment integration
- Revenue tracking (realized/unrealized/paidOut)
- Push notifications across multiple devices

### API Patterns

- **REST**: Data access/mutation, Webhooks (`/webhooks`), payments (`/payments`), health checks (`/health`)
- **Authentication**: JWT-based with optional auth support
- **Authorization**: Role-based access control with store-scoped permissions

### Development Workflow

1. Start Redis and PostgreSQL
2. Run API in development mode
3. Start desired frontend app(s)
4. Use Prisma Studio for database inspection

### Multi-Platform Support

- **iOS/Android**: React Native apps via Expo
- **Web**: Next.js with responsive design
- **Admin**: React Router SPA for platform administration

The platform serves the Nigerian retail market with features like multi-store following, inventory management, order tracking, and payment processing through Paystack.
