# Phase 1: Agent Health Foundation — Requirements

## Scope

### Included
- Project scaffold for a monorepo containing a Hono API and a Vite React frontend.
- SQLite database with Drizzle ORM schema and migrations.
- Core domain models: `Agent`, `Ailment`, `Therapy`.
- RESTful CRUD API endpoints for all three models.
- React dashboard pages: agent list, agent detail, create/edit agent, log ailment, record therapy.
- Seed data and a one-command local development startup script.

### Excluded
- User authentication and authorization (Phase 1 is open-access).
- Appointment scheduling (Phase 2).
- Marketing landing page and analytics charts (Phase 3).
- Real-time updates via WebSocket.
- External integrations or webhooks.

## Data Model

### Agent
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT (UUID) | PRIMARY KEY | Unique identifier |
| name | TEXT | NOT NULL | Human-readable name |
| type | TEXT | NOT NULL | e.g., "LLM", "RPA", "Scraper" |
| status | TEXT | NOT NULL | "healthy", "degraded", "offline" |
| description | TEXT | | Optional notes about the agent |
| createdAt | INTEGER | NOT NULL | Unix timestamp (ms) |

### Ailment
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT (UUID) | PRIMARY KEY | Unique identifier |
| agentId | TEXT | NOT NULL, FOREIGN KEY | Linked agent |
| symptom | TEXT | NOT NULL | Description of the symptom |
| severity | TEXT | NOT NULL | "low", "medium", "high" |
| status | TEXT | NOT NULL | "open", "closed" |
| createdAt | INTEGER | NOT NULL | Unix timestamp (ms) |
| closedAt | INTEGER | | Timestamp when resolved (nullable) |

### Therapy
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT (UUID) | PRIMARY KEY | Unique identifier |
| agentId | TEXT | NOT NULL, FOREIGN KEY | Linked agent |
| ailmentId | TEXT | FOREIGN KEY | Optional linked ailment |
| method | TEXT | NOT NULL | e.g., "restart", "rollback", "patch", "retrain" |
| result | TEXT | NOT NULL | "success", "failure", "in_progress" |
| notes | TEXT | | Optional details |
| createdAt | INTEGER | NOT NULL | Unix timestamp (ms) |

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Repository layout | Monorepo: `apps/api` and `apps/web` | Keeps backend and frontend aligned in a single branch; shared types can live in `packages/types` later |
| API style | RESTful JSON | Hono excels at lightweight REST; easy to test with curl and document |
| State management | React Query (TanStack Query) + Zustand if needed | React Query handles server-state caching; Zustand reserved for client-only UI state (modals, filters) |
| Validation | Zod | TypeScript-first, lightweight, and consistent across API and forms |
| Database access | Drizzle ORM with `better-sqlite3` driver | Type-safe queries, auto-generated migrations, minimal overhead |
| Styling approach | Tailwind CSS + custom color tokens | Supports "functions and visuals equally" goal; fast iteration without leaving JSX |
| Timestamps | INTEGER (Unix ms) | Simple, sortable, and language-agnostic |
| IDs | UUID v4 (TEXT) | Avoids sequential ID leaks; easy to generate in JS or SQLite |

## Context

### Tone & Visual Standards
- Clean, professional SaaS aesthetic.
- Primary color: indigo/slate palette for trust and clarity.
- Cards and tables for data density; clear hierarchy with typography.
- Responsive down to 768 px for Phase 1 (full mobile polish in Phase 3).

### Stack Pointers
- **Backend**: Hono on Node.js, SQLite via Drizzle, Zod validation.
- **Frontend**: Vite + React + TypeScript, React Router v6, Tailwind CSS.
- **Package manager**: pnpm.
- **Testing**: Vitest for API tests; no Playwright yet (reserved for Phase 3+).

### Open Questions
- Should `Agent.status` be enum-restricted at the DB level or application level? → **Decision**: Application-level Zod enums for flexibility; DB uses TEXT.
- Should closing an ailment auto-create a therapy record? → **Decision**: No. Users manually record therapies to keep the model explicit.
