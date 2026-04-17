# AgentClinic

Health management system for AI agents.

## Quick Start

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- API: http://localhost:3001
- Web UI: http://localhost:5173

## Tech Stack

- **API**: Hono + Drizzle ORM + SQLite
- **Web**: React + Vite + TanStack Query + Tailwind CSS
- **Monorepo**: pnpm workspaces
