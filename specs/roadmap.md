# AgentClinic — Roadmap

## Overview

Delivery strategy: **MVP first, then expand**. Each phase is designed to ship in 1–3 weeks, delivering a working, valuable increment. We validate the core agent-health workflow before adding analytics, marketing polish, or advanced integrations.

---

## Phase 1: Agent Health Foundation (Weeks 1–2)

**Goal**: Build the core agent registry and ailment-tracking system.

**Deliverables**:
- [ ] Hono + TypeScript project scaffold with SQLite and Drizzle setup
- [ ] Data models: `Agent`, `Ailment`, `Therapy`
- [ ] API endpoints: create/read/update agents; log ailments; record therapies
- [ ] Basic React dashboard: list agents, view agent details, add ailments and therapies
- [ ] Seed data and local dev environment (one-command startup)

**Dependencies**: None

**Success Criteria**:
- An operator can register an agent, log an ailment, and record a therapy in under 2 minutes
- All CRUD operations pass automated API tests
- Dashboard renders correctly in the latest Chrome, Firefox, and Edge

---

## Phase 2: Appointments & Scheduling (Weeks 2–3)

**Goal**: Enable booking and managing appointments for agent diagnostics and maintenance.

**Deliverables**:
- [ ] Data model: `Appointment` (linked to `Agent` and optional `Ailment`)
- [ ] API endpoints: create, update, cancel, and list appointments
- [ ] Calendar / list view in the dashboard for upcoming appointments
- [ ] Simple conflict detection (no overlapping appointments for the same resource)
- [ ] Email or in-app notification stubs (logged for now; real delivery in Phase 4)

**Dependencies**: Phase 1

**Success Criteria**:
- 95%+ of appointment bookings complete without error
- Operators can view and filter appointments by agent, date, and status
- Conflicting appointments are rejected at the API level

---

## Phase 3: Dashboard, Analytics & Marketing Polish (Weeks 3–4)

**Goal**: Make the product attractive and insightful for stakeholders.

**Deliverables**:
- [ ] Attractive landing / marketing page (Steve’s requirement)
- [ ] Health overview dashboard with summary cards: total agents, open ailments, upcoming appointments
- [ ] Charts: ailment trends over time, therapy success rate
- [ ] Responsive design pass for mobile and tablet
- [ ] Dark mode support

**Dependencies**: Phase 1, Phase 2

**Success Criteria**:
- Marketing page loads in < 1 second and passes Lighthouse accessibility checks
- Dashboard summaries update within 500 ms of data changes
- UI is fully usable on screens down to 375 px width

---

## Phase 4: Integrations & Scale (Future)

**Goal**: Connect AgentClinic to real agent infrastructure and prepare for production scale.

**Deliverables**:
- [ ] Webhook or API integration to ingest agent telemetry and auto-create ailments
- [ ] Email / Slack notification delivery for appointments and critical ailments
- [ ] Optional migration path from SQLite to PostgreSQL
- [ ] Role-based access control (admin vs. operator vs. viewer)
- [ ] Audit logging for all health record changes

**Dependencies**: Phase 1–3

**Success Criteria**:
- External agent systems can push health events and see them reflected in AgentClinic within 30 seconds
- Notifications are delivered reliably for high-priority ailments and appointment reminders
- RBAC correctly restricts write access to authorized users
