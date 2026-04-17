# AgentClinic — Tech Stack

## Overview

Our tech philosophy is **minimal, proven, fast to iterate**. We favor lightweight, battle-tested tools that reduce operational overhead and let the team focus on domain logic. The stack is built around TypeScript end-to-end, with a compact backend runtime and a simple, embedded database for zero-config local development and easy deployment.

## Backend

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Runtime / language | Node.js + TypeScript | Mary requires a popular TypeScript stack; Node.js has the largest ecosystem and fastest hiring pool |
| Framework | Hono | Ultra-lightweight, fast, modern routing with excellent TypeScript support and middleware ergonomics |
| Database | SQLite | Zero-config, embedded, and sufficient for MVP scale; easy to back up and migrate |
| Query layer | Drizzle ORM (or raw SQL via `better-sqlite3`) | Type-safe SQL with minimal overhead; plays well with SQLite and Hono |
| Validation | Zod | TypeScript-first schema validation for request bodies and API contracts |

## Frontend

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | React (Vite) | Fast dev server, excellent HMR, and a familiar component model |
| Language | TypeScript | Shared type safety across frontend and backend |
| Styling | Tailwind CSS | Rapid UI iteration, consistent design system, and modern browser support for Steve’s marketing goals |
| State management | React Query (TanStack Query) + Zustand | Server-state caching and minimal client-state store |
| Routing | React Router (v6+) | Standard, declarative routing for SPAs |

## Development Tools

| Tool | Purpose |
|------|---------|
| pnpm | Fast, disk-space-efficient package manager |
| ESLint + Prettier | Linting and code formatting |
| Vitest | Unit and integration testing |
| Playwright | End-to-end browser testing |
| tsc | Type-checking across the monorepo |

## Deployment

| Stage | Environment | Architecture Sketch |
|-------|-------------|---------------------|
| MVP | Single VPS / Railway / Fly.io | Hono API server + SQLite on persistent disk; Vite-built static assets served from the same host or a CDN |
| Phase 2+ | VPS or container platform | Add backup/replication for SQLite, or migrate to PostgreSQL if scale demands it; keep Hono + React core |

## Constraints & Non-Goals

- **No microservices** for MVP: we stay monolithic to reduce complexity.
- **No real-time WebSocket layer** in MVP: polling is sufficient for dashboard updates.
- **Avoid heavy ORMs**: Prisma is intentionally skipped in favor of Drizzle or raw SQL to keep the bundle small.
