# Requirements & Scope Review — Phase 1: Agent Health Foundation

## Overview

Phase 1 scope is well-bounded: a monorepo containing a REST API and a React dashboard for managing agents, ailments, and therapies. The spec clearly separates what's included from what's deliberately excluded.

---

## Findings

### 1. Scope — Clearly Bounded

**Included** (well-defined):
- Monorepo scaffold with Hono API + Vite React frontend
- SQLite/Drizzle schema with three domain models
- Full CRUD for Agent, Ailment, Therapy
- React dashboard with list/detail/form pages
- Seed data and one-command startup

**Excluded** (explicitly documented):
- Authentication/authorization (Phase 1 is open-access)
- Appointment scheduling (Phase 2)
- Marketing landing page and analytics (Phase 3)
- WebSocket real-time updates
- External integrations/webhooks

**Verdict**: Excellent scope clarity. Operators know exactly what they're getting.

---

### 2. Data Model — Precise and Complete

The three-entity model (Agent → Ailment → Therapy) correctly represents the domain:

- `Agent.status` as application-level enum (Zod) rather than DB-level constraint — **correct decision** for flexibility.
- `Therapy.ailmentId` correctly nullable (a therapy can address an agent generally without a specific ailment).
- `Ailment.closedAt` nullable — correctly models that open ailments don't have a close timestamp.
- Cascade delete for agent correctly documented in API behavior.

**One ambiguity**: The spec says `DELETE /agents/:id` should cascade, but doesn't specify whether deleting an **ailment** cascades to therapies, or whether deleting an **ailment** is even allowed if it has linked therapies. This should be clarified in the API spec.

---

### 3. Success Criteria — Specific and Measurable

From **validation.md**, the automated checks are concrete:
- TypeScript compilation passes with zero errors
- Lint and format pass
- Vitest suites cover happy path and validation errors
- Specific API assertions (201 on create, 400 on invalid severity, 404 on missing agent, etc.)

The manual walkthrough is equally specific:
- Steps 1–7 cover the full E2E flow
- Edge cases are enumerated (validation errors, duplicate names allowed, 404 for non-existent agents)
- Tone & copy check ensures consistent terminology

**Issue**: "Dashboard renders correctly in Chrome, Firefox, and Edge" requires manual cross-browser testing. No CI/browser automation is planned for Phase 1. This is an acceptable limitation but should be tracked.

---

### 4. KPI Alignment — Good

The KPIs in **mission.md** are well-chosen:
- Onboarding time < 2 min ✓ aligned with Phase 1 scope (no auth friction)
- Dashboard load time < 500 ms ✓ (SQLite local, minimal JS)
- Therapy record accuracy > 98% ✓ (explicit linking, no auto-create)

The appointment booking KPI (>95%) is **Phase 2 territory** and correctly excluded from Phase 1.

---

### 5. Open Questions — Appropriately Resolved

Two open questions were raised and resolved in the spec:
1. `Agent.status` enum restriction level → **Resolved**: Application-level only.
2. Auto-create therapy on ailment close → **Resolved**: No, keep models explicit.

Both decisions are sound and documented.

---

## Gaps

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| Cascade behavior for ailment deletion not specified | Low | Add to API spec: does deleting an ailment cascade to therapies? |
| Cross-browser manual testing in Definition of Done | Low | Acceptable for MVP; note as Phase 3 improvement |
| No mention of data export or backup | Low | Not in scope for Phase 1 |

---

## Recommendations

1. **Clarify ailment deletion cascade**: Should `DELETE /ailments/:id` remove linked therapies, or should it fail if therapies exist? Add this to the API spec.
2. **No other spec changes required**: The requirements are clear, testable, and aligned with the mission.

---

## Conclusion

**Confidence: High**

Phase 1 requirements are well-scoped, unambiguous, and aligned with the mission. The only actionable gap is the cascade deletion ambiguity for ailments. All other findings are minor and do not block Phase 1 completion.
