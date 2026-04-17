# Phase 1: Agent Health Foundation — Plan

## 1. Project Scaffold & Tooling

- [x] 1.1 Initialize monorepo root with `pnpm-workspace.yaml` (packages: `apps/*`).
- [x] 1.2 Add root `package.json` with shared scripts: `dev`, `build`, `test`, `lint`, `typecheck`.
- [x] 1.3 Create `apps/api` directory and install dependencies: `hono`, `@hono/node-server`, `drizzle-orm`, `better-sqlite3`, `zod`, `uuid`, `@types/uuid`.
- [x] 1.4 Create `apps/web` directory with Vite React + TypeScript + Tailwind CSS template.
- [x] 1.5 Install web dependencies: `react-router-dom`, `@tanstack/react-query`, `axios` (or native `fetch` wrapper), `zod`.
- [x] 1.6 Configure shared TypeScript `base.json` and extend it in both apps.
- [x] 1.7 Add root `.gitignore` and environment variable templates (`.env.example`).

## 2. Database & Schema

- [x] 2.1 Configure Drizzle in `apps/api` with `drizzle.config.ts` pointing to a local SQLite file (`data/agentclinic.db`).
- [x] 2.2 Define schema files:
  - `apps/api/src/db/schema/agents.ts`
  - `apps/api/src/db/schema/ailments.ts`
  - `apps/api/src/db/schema/therapies.ts`
- [x] 2.3 Create initial Drizzle migration and a helper script (`db:migrate`).
- [x] 2.4 Add a database client singleton (`apps/api/src/db/client.ts`).
- [x] 2.5 Write a seed script (`apps/api/src/db/seed.ts`) that inserts sample agents, ailments, and therapies.

## 3. Backend API

- [x] 3.1 Scaffold Hono app in `apps/api/src/index.ts` with JSON parsing and error handling middleware.
- [x] 3.2 Implement `Agent` routes (`/agents`):
  - `GET /agents` — list all agents (optionally with status filter)
  - `GET /agents/:id` — get agent details with related ailments and therapies
  - `POST /agents` — create agent (Zod validation)
  - `PATCH /agents/:id` — update agent fields
  - `DELETE /agents/:id` — remove agent and cascade related records
- [x] 3.3 Implement `Ailment` routes (`/ailments`):
  - `GET /ailments` — list ailments (with agent name joined)
  - `POST /ailments` — create ailment for an agent
  - `PATCH /ailments/:id` — update severity or status; if status → "closed", set `closedAt`
- [x] 3.4 Implement `Therapy` routes (`/therapies`):
  - `GET /therapies` — list therapies (with agent and ailment names joined)
  - `POST /therapies` — create therapy linked to agent and optional ailment
  - `PATCH /therapies/:id` — update result or notes
- [x] 3.5 Add centralized error handler returning `{ error: string }` with appropriate HTTP status codes.
- [x] 3.6 Write Vitest tests for all route handlers covering happy path and validation errors.

## 4. Frontend UI

4.1 Set up React Router in `apps/web/src/main.tsx` with route definitions.
4.2 Set up TanStack Query `QueryClientProvider`.
4.3 Create shared layout component with top navigation (Agents, Ailments, Therapies) and footer.
4.4 Build **Agents** page (`/agents`):
  - Table listing agents with name, type, status, created date
  - "Add Agent" button opening a modal or navigating to `/agents/new`
  - Inline actions: edit, delete
4.5 Build **Agent Detail** page (`/agents/:id`):
  - Agent profile card
  - Tabs or sections: Ailments and Therapies
  - Buttons to log a new ailment or record a new therapy
4.6 Build **Ailments** page (`/ailments`):
  - Table listing all ailments with severity badge, status, agent name
  - Filter by status and severity
  - "Log Ailment" form
4.7 Build **Therapies** page (`/therapies`):
  - Table listing therapies with result badge, method, agent name
  - "Record Therapy" form
4.8 Add reusable components: `Badge`, `Button`, `Modal`, `FormInput`, `FormSelect`, `DataTable`.
4.9 Wire all forms to the backend API with React Query mutations and optimistic updates where appropriate.

## 5. Polish & Developer Experience

5.1 Add a root `dev` script that runs the API and the web dev server concurrently.
5.2 Ensure the API CORS configuration allows the Vite dev server origin.
5.3 Verify all TypeScript compiles without errors (`tsc --noEmit` in both apps).
5.4 Run lint and format passes (ESLint + Prettier).
5.5 Update `README.md` with setup instructions and a one-liner to start the project.
