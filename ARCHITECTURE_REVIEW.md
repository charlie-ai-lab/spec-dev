# Architecture & Tech Review — Phase 1: Agent Health Foundation

## Overview

Phase 1 establishes a minimal viable monorepo with a Hono REST API and a Vite React frontend backed by SQLite via Drizzle ORM. The tech stack is lean, the data model is straightforward, and the scope is tightly bounded.

---

## Findings

### 1. Tech Stack — Sound and Well-Justified

| Decision | Assessment |
|----------|-----------|
| **Hono** | Excellent choice for lightweight REST. Minimal overhead, built-in middleware, TypeScript-first. |
| **Drizzle + better-sqlite3** | Type-safe queries, auto-migrations, synchronous driver avoids async complexity for a single-server MVP. |
| **React Query + Zustand** | Appropriate split: server state via React Query, UI state via Zustand. |
| **Tailwind CSS** | Rapid iteration without leaving JSX. Consistent with the "functions and visuals equally" goal. |
| **pnpm workspaces** | Correct choice for monorepo. Strict enough to catch package mismatches, fast enough for development. |

**Verdict**: No concerns. Stack is proven, well-matched to the problem, and avoids unnecessary complexity.

---

### 2. Monorepo Structure — Good Foundation, Missing Shared Types

**Positive**: `apps/api` + `apps/web` layout is standard and clear. The plan explicitly notes shared types can live in `packages/types` later.

**Concern**: No `packages/types` exists in Phase 1. This means API response shapes are duplicated or handwritten in the frontend. As the API grows, this will create drift risk between API contracts and frontend types.

**Recommendation**: Add a minimal `packages/types` package in Phase 1 or a future refactor task, even if just re-exporting Zod schemas. This is a **medium-risk** debt item for future phases.

---

### 3. Database Design — Clean with One Minor Gap

**Positive**: UUID primary keys avoid enumeration leaks. Unix ms timestamps are sortable without timezone ambiguity. Nullable `closedAt` and `ailmentId` correctly model optional relationships.

**Gap**: Foreign keys exist at the application level (Zod validation) but not enforced at the DB level with `ON DELETE CASCADE`. The plan references cascade deletion in API behavior, but Drizzle's SQLite driver may not enforce FK constraints by default (SQLite requires `PRAGMA foreign_keys = ON`).

**Recommendation**: Verify `PRAGMA foreign_keys = ON` is set in the DB client singleton. If cascade behavior is implemented in application code rather than DB constraints, document this explicitly to avoid future confusion.

---

### 4. API Design — RESTful and Consistent

**Positive**: All three resources follow consistent CRUD patterns. Centralized error handler with `{ error: string }` shape is a good convention.

**Minor Issue**: No pagination specified for `GET /agents`, `GET /ailments`, `GET /therapies`. For an MVP with seed data this is fine, but the spec should note this is a known limitation for future scale.

---

### 5. Frontend Architecture — Solid, Well-Componentized

**Positive**: Reusable component library (`Badge`, `Button`, `Modal`, `FormInput`, `FormSelect`, `DataTable`) is explicitly planned and checked off. TanStack Query mutations with optimistic updates are mentioned.

**Concern**: No mention of error boundaries or graceful degradation for API failures. If the API is slow or returns errors, the UI should handle this without crashing. This is acceptable for Phase 1 MVP but should be on the Phase 2 backlog.

---

### 6. No Authentication — Correct for Phase 1

The spec explicitly states Phase 1 is open-access. This is a conscious decision that should be documented in the validation criteria. No concerns here — just confirming the boundary is intentional.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| API/frontend type drift (no shared types package) | Medium | Add `packages/types` in Phase 2 |
| FK cascade behavior not verified in SQLite | Low-Medium | Verify `PRAGMA foreign_keys = ON` in DB client |
| No pagination → poor performance at scale | Low | Document as Phase 2 improvement |
| No error boundaries in React UI | Low | Add to Phase 2 backlog |

---

## Recommendations

1. **Verify foreign key enforcement**: Ensure the Drizzle DB client sets `PRAGMA foreign_keys = ON`.
2. **Add shared types package**: Even a minimal one — even just re-exporting Zod schemas as TypeScript types — prevents contract drift.
3. **Document pagination as known limitation**: Not a Phase 1 issue, but the spec should reflect this is intentional for the MVP scope.
4. **No changes needed to the spec itself**: The architecture is sound for the stated goals.

---

## Conclusion

**Confidence: High**

The Phase 1 architecture is well-suited to its goals. The stack is minimal but complete, the data model is correct, and the boundaries (what's included vs. excluded) are clearly documented. The concerns raised are medium-term debt items, not blockers for Phase 1 completion.

No changes to the spec are required. All findings are recommendations for future phases or implementation verification.
