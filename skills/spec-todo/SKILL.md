---
name: spec-todo
description: Creates or updates specs constitution docs (mission.md, tech-stack.md, roadmap.md) from an existing project. Triggers when user says "spec todo", "create todo specs", "initialize todo specs", "generate todo specs", or asks to create specification documents for an existing project. This skill reads project files directly and generates docs with minimal or no questions.
---

# Spec Todo

Builds constitution documents from an existing project. Performs comprehensive scanning based on README.md and project files, marks all phases as completed by default, and builds pending phases from TODO.md.

## Workflow

### Step 1: Comprehensive Project Scan

Read files in priority order to extract constitution-building information:

```
Scan Priority:
1. README.md                 → Project positioning, tech stack, feature descriptions
2. package.json              → Project name, dependencies, scripts
3. .omc/project-memory.json  → Scanned project structure
4. specs/*.md (existing)     → Existing constitution
5. skills/*/SKILL.md         → Project feature modules
6. git log --oneline         → Recent development history
7. Other config files        → Technical details
```

### Step 2: Generate Constitution Documents

Create three files in `specs/`:

#### mission.md — Project Mission

```markdown
# Mission

## Core Mission
[One-sentence summary of project's core mission]

## Value Proposition
[3-5 value propositions]

## Target Users
- [User segment 1]
- [User segment 2]

## Success Metrics / KPIs
- [KPI 1]
- [KPI 2]

## Why This Project Exists
[Reason the project exists]
```

#### tech-stack.md — Tech Stack

```markdown
# Tech Stack

## Languages
| Language | Version | Purpose |
|----------|---------|---------|
| [Lang]   | [Ver]   | [Use]   |

## Frameworks & Libraries
| Framework | Version | Purpose |
|-----------|---------|---------|
| [FW]      | [Ver]   | [Use]   |

## Dev Tools
| Tool | Purpose |
|------|---------|
| [Tool] | [Use]   |

## Deployment
[Deployment approach and platform]

## Constraints & Non-Goals
### Constraints
- [Constraint 1]

### Non-Goals
- [Non-goal 1]
```

#### roadmap.md — Roadmap

**Core Rule: All phases marked as ✅ Completed by default**

```markdown
# Roadmap

## Phases

### Phase 1: [Completed Phase Name]
- **Status**: ✅ Completed
- **Goal**: [Phase goal]
- **Deliverables**: [Deliverables]
- **Success Criteria**: [Success criteria]

<!-- Additional completed phases discovered -->

### Phase N: [Pending Phase Name]
- **Status**: ⬜ Pending
- **Goal**: [Phase goal]
- **Deliverables**: [Deliverables]
- **Dependencies**: [Dependencies]
- **Success Criteria**: [Success criteria]

---
**Last Updated**: YYYY-MM-DD
```

### Step 3: Handle TODO.md

```
IF project has TODO.md:
    Read TODO.md content
    Convert each TODO.md entry into a Pending Phase in roadmap.md
    Use TODO.md's structured info to populate pending phase details
ELSE:
    Infer pending phases from README.md's described feature roadmap
    If README has no roadmap, roadmap only contains completed phases
```

### Step 4: Write Files

Create or update in `specs/`:
- `specs/mission.md`
- `specs/tech-stack.md`
- `specs/roadmap.md`

If `specs/` already exists, confirm with user before overwriting.

## Constraints

1. **Prefer reading files** — Minimize questions, at most 1 clarifying question
2. **Completed first** — All phases discovered from git log/README/project files marked as completed
3. **TODO-driven pending** — Pending phases strictly read from TODO.md
4. **English output** — All documents use English punctuation and formatting
5. **Idempotent execution** — On repeated runs, only update changed parts

## Output Format

```
✅ Constitution documents created:

specs/
├── mission.md      # Project mission and value proposition
├── tech-stack.md   # Tech stack details
└── roadmap.md      # Phase roadmap (N phases, M completed)

Completed phases: [X]
Pending phases: [Y]
```