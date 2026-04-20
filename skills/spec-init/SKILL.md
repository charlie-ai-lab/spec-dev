---
name: spec-init
description: Initialize project specs foundation by reading README.md for stakeholder context, interviewing the user on mission/tech/roadmap, and creating the constitution documents (mission.md, tech-stack.md, roadmap.md) in the specs/ directory. Trigger when the user says "init specs", "spec init", "initialize specs", "/spec-init", or during project kickoff.
---

# Spec Init

## Workflow

### 1. Read the README.md

Extract stakeholder context, problem statement, core features, and use cases. This is your source of truth for project vision and constraints.

### 2. Interview the user — BEFORE writing any files

Use `vscode_askQuestions` with exactly **3 questions grouped in one call**:

| Header | Question focus |
|--------|---------------|
| **Mission & Vision** | What is the core problem being solved? Who are the primary users? What success looks like? Any constraints or non-goals? |
| **Technology & Architecture** | Are there stack preferences, infrastructure constraints, or existing systems to integrate with? Any "must-use" or "must-not-use" technologies? |
| **Roadmap & Phasing** | How should the project be broken into phases? What's MVP scope vs. future phases? Any hard deadlines or priority order? |

Do **not** write any files until the user has answered all three questions.

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
- **Development Tools**: Table with tool name and purpose (linting, testing, formatting, docs)
- **Deployment**: Table with stage (MVP/phase N), environment, and architecture sketch

Tone: Technical, pragmatic, rationale-driven.

#### `specs/roadmap.md`
**Purpose**: Implementation order — phases broken into manageable, shippable units.

Structure:
- **Overview**: High-level delivery strategy (e.g., "2-3 week phases, MVP first, then expansions")
- **Phase breakdown**: For each phase, list:
  - Phase name and estimated timeline
  - High-level goal (1 sentence)
  - Key deliverables (bullet list)
  - Dependencies on prior phases (if any)
  - Success criteria

Format each phase as a section with checkbox tracking (initially all `[ ]` unchecked).

Example:
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
