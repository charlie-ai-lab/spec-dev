---
name: spec-mvp
description: Defines the MVP scope by reviewing specs/roadmap.md, creating an mvp branch, interviewing the user about MVP features, and writing a dated spec directory containing plan.md, requirements.md, and validation.md. Then executes the plan and updates the changelog. Trigger when the user says "spec mvp", "define mvp", "create mvp spec", "start mvp", or invokes /spec-mvp.
---

# Spec MVP

## Workflow

### 1. Read the roadmap

Read `specs/roadmap.md` to understand all planned phases and features. Extract:
- Phase names and high-level goals
- Key deliverables per phase
- Dependencies between phases

Also read `specs/mission.md` and `specs/tech-stack.md` for context.

### 2. Create the mvp branch

```bash
git checkout -b mvp
```

### 3. Interview the user — BEFORE writing any files

Use `vscode_askQuestions` with exactly **3 questions grouped in one call**:

| Header | Question focus |
|--------|---------------|
| **MVP Scope** | Which features from the roadmap are essential for MVP? What is the minimum viable product that proves the core value? Any features to explicitly defer? |
| **MVP Decisions** | What are key UX/technical choices for the MVP? What can be simplified for speed (and revisited post-launch)? Any MVP-specific constraints or shortcuts? |
| **MVP Timeline & Success** | What's the target timeline for MVP launch? What does success look like? How will you measure it (user feedback, metrics, adoption)? |

Do **not** write any files until the user has answered all three questions.

### 4. Create the MVP spec directory

Name: `specs/MVP-<date>-mvp/` using today's date in format `YYYY-MM-DD`.

Example: `specs/2026-04-17-mvp/`

#### `specs/MVP-<date>-mvp/requirements.md`

**Purpose**: MVP scope and execution strategy.

Structure:
- **Scope**: What features are included; what is explicitly deferred
- **User Value**: How does the MVP deliver on the mission?
- **Decisions**: Key MVP-specific choices (tech shortcuts, UX simplifications, etc.)
- **Success Criteria**: Clear definition of what MVP launch looks like
- **Context**: Constraints, non-goals, anything shaping the MVP spec

Reference: `specs/mission.md` (align to mission), `specs/tech-stack.md` (respect stack choices)

Tone: Crisp, focused, launch-ready.

#### `specs/MVP-<date>-mvp/plan.md`

**Purpose**: Executable task breakdown for MVP delivery.

Structure:
- **Overview**: High-level delivery strategy (e.g., "4-week sprint, frontend-first, then backend")
- **Feature groups**: Group tasks by feature or layer (e.g., Request Assessment → Clarification Guide → Knowledge Base)
- **Task list**: For each group, numbered sub-tasks with estimated effort (S/M/L)
  - Each task should be independently reviewable
  - Include acceptance criteria (what "done" means)
  - Flag any blockers or dependencies

Format:
```markdown
## Feature Group 1: Request Assessment (Est. 1-2 weeks)

### Task 1.1: API Endpoint Design
- [ ] Define request schema (fields, validation)
- [ ] Design scoring algorithm (clarity, feasibility, risk)
- [ ] Write API contract in OpenAPI

Effort: M
Acceptance: OpenAPI spec complete, schema validated against 5 test cases

### Task 1.2: Backend Implementation
- [ ] Build request submission endpoint
- [ ] Implement scoring logic
- [ ] Wire up to database

Effort: L
Acceptance: POST /requests returns scoring within 500ms
```

#### `specs/MVP-<date>-mvp/validation.md`

**Purpose**: How to verify the MVP is ready to ship.

Structure:
- **Automated Validation**: Tests, type checks, build pass
  - Project test suite passes
  - TypeScript/linter checks pass
  - Specific test assertions for MVP features
- **Manual Validation**: User flows, edge cases, UX coherence
  - Walkthrough each MVP user flow end-to-end
  - Test key edge cases
  - Tone/UX consistency check (if applicable)
- **Definition of Done**: Checklist for MVP launch
  - All MVP tasks completed
  - All automated tests pass
  - All manual validation passed
  - CHANGELOG.md updated
  - Ready for deployment

Tone: Concrete, verifiable, no ambiguity.

### 5. Write the spec files

Once the user has answered all three questions, create the three files in the MVP spec directory.

### 6. Implement the plan

Execute the tasks in `plan.md`:
- For each feature group and task:
  1. Create a feature branch: `git checkout -b mvp-task-<N>-<name>`
  2. Implement the task
  3. Run validation checks (tests, types, build)
  4. Commit with clear message: `feat(mvp): <task name>`
  5. Merge back to mvp branch
  6. Update `plan.md` with task completion: `- [x]`

### 7. Update changelog

Once all MVP tasks are complete, run the changelog skill:

```bash
python3 <path-to-changelog-skill>/scripts/changelog.py
```

This extracts all commits on the mvp branch since inception and creates dated entries.

Commit the updated CHANGELOG.md:
```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for MVP delivery"
```

### 8. Summary and next steps

Report to the user:
- MVP spec created and documented
- All MVP tasks implemented and tested
- Changelog updated with all MVP work
- MVP is ready for launch / next phase review

Suggest:
- Deploy MVP to staging/production
- Gather user feedback
- Plan Phase 2 based on learnings

## Quality gates

- [ ] User answers all 3 MVP questions before writing files
- [ ] All MVP tasks in plan.md have acceptance criteria
- [ ] All automated validation passes (tests, types, build)
- [ ] All manual validation passes (user flows, edge cases)
- [ ] CHANGELOG.md updated with all MVP commits
- [ ] mvp branch is clean and ready to merge

## Constraints

- MVP scope must be achievable in defined timeline
- All MVP decisions must be justified in requirements.md
- Tech stack choices from specs/tech-stack.md must be respected
- Refer to specs/mission.md to ensure MVP delivers core value
- No new dependencies without explicit user approval

## Related skills

- **spec-init**: Bootstrap specs foundation (mission, tech-stack, roadmap)
- **feature-spec**: Create individual feature specs
- **spec-review**: Deep multi-perspective review of branch changes
- **changelog**: Maintain CHANGELOG.md from git history
