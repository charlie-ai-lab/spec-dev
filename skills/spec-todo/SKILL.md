---
name: spec-todo
description: Creates or updates specs constitution docs (mission.md, tech-stack.md, roadmap.md) from an existing project. Triggers when user says "spec todo", "create todo specs", "initialize todo specs", "generate todo specs", or asks to create specification documents for a existsing project. This skill reads project files directly and generates docs with minimal or no questions.
---

# Spec Todo

Creates constitution docs from an existing project by reading its files.

## Workflow

### 1. Read project files

```
README.md
specs/mission.md (existing, if any)
specs/tech-stack.md (existing, if any)
specs/roadmap.md (existing, if any)
```

### 2. Extract key information

| Info | Source |
|------|--------|
| Project name & positioning | README.md first paragraph |
| Tech stack | README.md + package.json |
| Target users | README.md or code |
| Existing roadmap | specs/roadmap.md (if exists) |
| In-progress/completed work | Code or conversation context |

### 3. Generate Constitution Docs

In `specs/`:

#### `mission.md`
- Core mission and value proposition
- Target users (from README)
- Success metrics/KPIs

#### `tech-stack.md`
- Backend, frontend, dev tools tables
- Deployment approach
- Constraints and non-goals

#### `roadmap.md`
- Phased delivery based on existing specs/roadmap.md or TODO.md
- Each phase: goal, deliverables, dependencies, success criteria
- Keep phases small (1-3 weeks each)

### 4. Questions (only if needed)

Ask **max 3 grouped questions** only if critical info is missing and cannot be inferred from project files.

### 5. Write to disk

Create or update files in `specs/` directory.

## Notes

- Prefer reading project files over asking questions
- If specs/ already exists and is complete, skip to confirming what needs updating
- Keep mission.md focused on the "why", tech-stack.md on the "how", roadmap.md on the "what and when"
