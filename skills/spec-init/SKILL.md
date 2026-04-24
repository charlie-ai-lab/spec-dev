---
name: spec-init
description: Initialize project specs foundation by reading README.md for stakeholder context, interviewing the user on mission/tech/roadmap, and creating the constitution documents (mission.md, tech-stack.md, roadmap.md) in the specs/ directory. If the project involves a frontend/UI, the first phase must be a prototype design phase with mock data, multi-agent page implementation, and one-click deployment. Trigger when the user says "init specs", "spec init", "initialize specs", "/spec-init", "prototype first", "frontend prototype", or during project kickoff.
---

# Spec Init

## Workflow

### 1. Read the README.md

Extract stakeholder context, problem statement, core features, and use cases. This is your source of truth for project vision and constraints.

If the project involves a **frontend/UI** (web app, dashboard, admin panel, mobile app, etc.), also extract:
- **Pages/Screens**: What distinct views or pages are mentioned?
- **User flows**: What key journeys do users take through the UI?
- **UI complexity**: Is it data-dense (tables, charts), content-heavy (marketing pages), or interaction-heavy (forms, wizards, real-time)?
- **Target devices**: Desktop-only, mobile-first, or responsive?

**Decision gate**: If README describes user-facing screens, forms, dashboards, or any interactive UI, treat this as a **frontend project** and prepare Phase 1 as Prototype Design.

### 2. Interview the user — BEFORE writing any files

Use `vscode_askQuestions` with exactly **3 questions grouped in one call**:

| Header | Question focus |
|--------|---------------|
| **Mission & Vision** | What is the core problem being solved? Who are the primary users? What success looks like? Any constraints or non-goals? |
| **Technology & Architecture** | Are there stack preferences, infrastructure constraints, or existing systems to integrate with? Any "must-use" or "must-not-use" technologies? |
| **Roadmap & Phasing** | How should the project be broken into phases? What's MVP scope vs. future phases? Any hard deadlines or priority order? |

**If the project has a frontend/UI**, ask an additional **Frontend Prototype** question (can be grouped as a 4th question or appended to Technology):

| Header | Question focus |
|--------|---------------|
| **Frontend Prototype** | Do you want Phase 1 to be a clickable frontend prototype with mock data for stakeholder validation? Any preferred frontend frameworks (React/Vue/Angular/Svelte), UI library (Ant Design/Material-UI/Tailwind), or design constraints? |

Do **not** write any files until the user has answered all three questions (four if frontend is involved).

### 3. Create the specs/ directory

```bash
mkdir -p specs/
```

#### `specs/mission.md`
**Purpose**: Project constitution — the shared north star for all decisions.

Structure:
- **Core Mission**: 1-2 sentences: what problem is solved and for whom
- **Core Value Propositions**: 3-5 bullet points of key benefits
- **Key Success Metrics (KPIs)**: Table format with metric name, target, and brief explanation
- **Target Audience**: Primary, secondary, tertiary user segments
- **Investment Rationale**: Why this project matters; what barriers it removes

Tone: Formal, aspirational, decision-making lens.

#### `specs/tech-stack.md`
**Purpose**: Technology foundation — what tools, languages, and platforms.

Structure:
- **Overview**: High-level tech philosophy (e.g., "minimal, proven, fast to iterate")
- **Backend**: Table with component, choice, and rationale
  - Runtime/language
  - Framework
  - Database
  - Task queue / async processing
  - ORM / query layer
- **Frontend**: Table with component, choice, and rationale
  - Framework
  - Styling
  - State management
  - Build tooling
  
  **If the project has a frontend/UI, recommend 2-3 framework combinations** based on project nature:
  | Project Type | Recommended Stack | Rationale |
  |-------------|-------------------|-----------|
  | Admin/Dashboard | React + Ant Design + Vite | Rich data components, fast build, mature ecosystem |
  | Marketing/Content | Next.js + Tailwind CSS | SEO-friendly, server rendering, modern styling |
  | Mobile-first PWA | Vue 3 + Vant/Varlet + Vite | Lightweight, mobile-optimized components |
  | Real-time/Interactive | React + Zustand + WebSocket lib | Strong state management, reactive UI |
  | Desktop-like SPA | React + Material-UI + Redux Toolkit | Comprehensive component set, predictable state |
  
  Let the user pick one or propose their own. Document the choice and rationale.
- **Development Tools**: Table with tool name and purpose (linting, testing, formatting, docs)
- **Deployment**: Table with stage (MVP/phase N), environment, and architecture sketch

Tone: Technical, pragmatic, rationale-driven.

#### `specs/roadmap.md`
**Purpose**: Implementation order — phases broken into manageable, shippable units.

Structure:
- **Overview**: High-level delivery strategy (e.g., "2-3 week phases, MVP first, then expansions")
  - **If the project involves a frontend/UI**, Phase 1 MUST be **Prototype Design** — a real, runnable frontend project with mock data, designed for rapid stakeholder validation. No backend code in this phase.
- **Phase breakdown**: For each phase, list:
  - Phase name and estimated timeline
  - High-level goal (1 sentence)
  - Key deliverables (bullet list)
  - Dependencies on prior phases (if any)
  - Success criteria

Format each phase as a section with checkbox tracking (initially all `[ ]` unchecked).

**Example for frontend projects** (Phase 1 = Prototype Design):
```
## Phase 1: Prototype Design (Weeks 1-2)

**Goal**: Build a complete, clickable frontend prototype with mock data for stakeholder review and requirement confirmation.

**Deliverables**:
- [ ] System-wide design system (color palette, typography, spacing, component primitives)
- [ ] Global layout shell (navigation, sidebar, header, footer, responsive grid)
- [ ] Page 1: [e.g., Login/Dashboard] — fully implemented with interactions
- [ ] Page 2: [e.g., Data Table/Form] — fully implemented with interactions
- [ ] Page 3: [e.g., Settings/Detail View] — fully implemented with interactions
- [ ] Unified mock data layer (mock API routes + realistic seed data)
- [ ] Frontend routing definition (all routes mapped, route guards if needed)
- [ ] Build and package into `dist/`, then provide a one-click static server script to browse `dist/` (e.g., `npx serve dist`, `python -m http.server 8080 --directory dist`, or a simple `start.sh` / `start.bat`). The launch script must NOT reference source code — it only serves the compiled `dist/` output.

**Implementation Method**:
1. Use `ui-ux-pro-max` or `frontend-design` skill to establish design system and global layout
2. Dispatch **parallel subagents** (one per page/major component) for concurrent page implementation
3. All pages consume the **same mock data service** — define API contracts (routes, request/response shapes) but implement as local mocks
4. Each agent commits to a shared branch; integrate and verify at phase end

**Dependencies**: None

**Success Criteria**:
- Project builds successfully with zero errors (`npm run build` passes), output goes to `dist/`
- A static file server script serves `dist/` in one command (e.g., `npx serve dist` or `python -m http.server 8080 --directory dist`)
- Every page defined in README is navigable and visually complete
- All interactive elements (buttons, forms, modals, tables) respond to user input
- Mock data is consistent across all pages and realistic enough for demos
- Stakeholder can run the prototype independently without backend setup
```

**Example for non-frontend projects**:
```
## Phase 1: Request Assessment Engine (Weeks 1-2)

**Goal**: Build the core request-triage system.

**Deliverables**:
- [ ] API endpoint for request submission
- [ ] Scoring algorithm (clarity, feasibility, risk)
- [ ] UI for viewing assessment results

**Dependencies**: None

**Success Criteria**:
- System correctly classifies 10 test requests per category
- Response time < 500ms
```

Tone: Action-oriented, milestone-focused.

## Constraints

- All decisions must be justified and traceable to mission, user needs, or technical constraints
- Tech stack choices should balance speed-to-market with long-term maintainability
- Roadmap phases should be small enough to ship in 1-3 weeks, large enough to be valuable
- Avoid over-engineering; start minimal and iterate

### Prototype Design Phase Constraints (Phase 1 for Frontend Projects)

When Phase 1 is Prototype Design, enforce these rules:

- **No backend code**: The prototype is frontend-only. API contracts are defined (routes, request/response schemas) but implemented as local mocks.
- **Unified mock data**: All pages consume a single mock data service. No hardcoded data inside components. Mock data must be realistic and consistent across pages.
- **Design system first**: Establish global styles, colors, typography, spacing, and shared components BEFORE building individual pages. Use `ui-ux-pro-max` or `frontend-design` skill.
- **Multi-agent parallel execution**: After design system is defined, dispatch parallel subagents (one per page/major feature) for concurrent implementation. Each agent works on an independent page/module.
- **Real, not placeholder**: Pages must be fully functional in terms of UI interactions — buttons click, forms validate, modals open, tables sort/filter, navigation works. "Lorem ipsum" is acceptable for content, but structure and behavior must be complete.
- **One-click launch**: The prototype must build (`npm run build` or equivalent) to `dist/`, then launch a static file server pointing at `dist/` with a single command (e.g., `npx serve dist` or a provided `start.sh`/`start.bat`). The launch mechanism must serve compiled assets only, never source code.
- **API contract documentation**: Even though mocked, document all API routes (path, method, request shape, response shape) so Phase 2+ can replace mocks with real backend calls without redesigning the frontend.
- **Version control**: Prototype code lives in the same repo as the final product. It is the foundation, not a throwaway.
