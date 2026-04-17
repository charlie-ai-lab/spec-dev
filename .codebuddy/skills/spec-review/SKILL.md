---
name: spec-review
description: Performs a deep multi-perspective review of spec changes on the current branch. Spawns multiple review subagents to examine changes from architecture, implementation, and requirements angles, then updates the changelog. Trigger when the user says "spec review", "review specs", "deep review", or invokes /spec-review.
---

# Spec Review

## Core Principle

**Code must ALWAYS be runnable, testable, and deliverable.** No exceptions. Before declaring a phase complete, ALL automated validation items must be executed and pass. Shell commands are always available for execution — use them.

---

## Workflow

### 1. Verify git state

Check that you're on a feature/spec branch (not main/master):
```bash
git branch --show-current
```

If on main/master, ask the user to checkout the feature branch first.

### 2. Identify changed files

Get the list of modified spec files on this branch:
```bash
git diff --name-only origin/main HEAD
```

Focus on files in `specs/` and related documentation.

### 3. Read spec files

Read the current phase's spec files:
- `specs/YYYY-MM-DD-<name>/validation.md` — what needs to be verified
- `specs/YYYY-MM-DD-<name>/plan.md` — what was promised
- `specs/YYYY-MM-DD-<name>/requirements.md` — what scope was defined

### 4. Spawn review subagents — THREE parallel reviews

Use `runSubagent` to spawn **three independent review perspectives**:

#### Subagent 1: Architecture & Tech Review
**Purpose**: Examine if tech decisions are sound, internally consistent, and aligned with constraints.

**Input context**:
- Current branch name
- List of changed files
- Instruction: "Review all spec changes for technical soundness. Check:
  - Tech stack choices are justified and consistent
  - Architecture decisions support roadmap goals
  - Infrastructure/deployment choices are realistic
  - Anything that could break builds or create future debt"

**Output**: ARCHITECTURE_REVIEW.md with findings, concerns, and recommendations

#### Subagent 2: Requirements & Scope Review
**Purpose**: Validate that feature specs align with mission, have clear scope, and success criteria are testable.

**Input context**:
- Current branch name
- List of changed files
- Instruction: "Review all spec changes for requirements clarity. Check:
  - Each feature scope is clearly bounded (what is/is not included)
  - Success criteria are specific and measurable
  - Feature aligns with mission and roadmap goals
  - Dependencies are explicit
  - Anything ambiguous or missing"

**Output**: REQUIREMENTS_REVIEW.md with findings, gaps, and recommendations

#### Subagent 3: Implementation Feasibility Review
**Purpose**: Assess whether the specs are implementable within constraints, have realistic effort estimates, and task breakdown is sound.

**Input context**:
- Current branch name
- List of changed files
- Tech stack from specs/tech-stack.md
- Instruction: "Review all spec changes for implementation feasibility. Check:
  - Task breakdown is detailed enough for execution
  - Effort estimates are realistic
  - Dependencies between tasks are clear
  - No hidden complexity or risky assumptions
  - Anything that could derail execution"

**Output**: FEASIBILITY_REVIEW.md with findings, risks, and recommendations

### 5. Run & Verify — MANDATORY

> **This step is NON-OPTIONAL. All automated validation items MUST be executed.**

Read `validation.md` and execute ALL items in the "Automated Checks" section. Do NOT skip this step because "the code looks fine" or "it was already tested before". The only way to verify runnability is to run.

#### For each validation item:

1. **Parse the validation command** (e.g., `pnpm test`, `tsc --noEmit`, `curl http://localhost:3001/health`)
2. **Execute it** using the shell — shell commands are always available
3. **Record the actual output** (not just "passed")
4. **Mark it complete** with evidence in validation.md

#### Validation item types:

| Type | Definition | Example |
|------|------------|---------|
| **Command** | Executable via shell | `tsc --noEmit`, `pnpm test`, `curl /health` |
| **Script** | Runs a script file | `node scripts/migrate.ts`, `python3 scripts/deploy.py` |
| **Automated Test** | Runs test suites | Vitest, Jest, Playwright (headless) |
| **Log Inspection** | Checks application logs | Verify no errors in startup logs |
| **API Test** | HTTP request/response | curl, httpie, or similar |
| **Manual (Browser)** | Requires human visual check | UI rendering, cross-browser, E2E click-through |

#### Rules:
- Items in "Automated Checks" or that can be verified by running commands → MUST execute
- Items in "Manual (Browser Required)" → Skip in this step, note as pending
- If execution fails → Fix the code, do not skip
- Document actual command output, not just "passed"

#### Common validation patterns:

```bash
# TypeScript
tsc --noEmit
pnpm typecheck

# Lint & Format
pnpm lint
pnpm format --check

# Tests
pnpm test
vitest run
jest

# API Health
curl http://localhost:3001/health
curl -X POST http://localhost:3001/resource -d '{}'

# Dev server startup
pnpm dev
# Verify server starts without errors

# Build
pnpm build
```

### 6. Collect and synthesize findings

Review the three output documents + execution results. Identify:
- **Consensus issues**: Problems all three reviewers flagged → High priority
- **Single-perspective issues**: One reviewer's concern → Discuss with user
- **Improvements**: Suggestions that enhance clarity/quality

Ask the user:
```
I've completed a three-angle review of your spec changes. Here are the findings:

[Synthesized summary of all three reviews with consensus issues listed first]

Validation execution results:
[Table of validation items with actual command output]

Would you like to:
1. Address findings and iterate
2. Accept findings and move to changelog
3. Dive deeper on a specific concern
```

### 7. Fix any issues found

If validation fails or issues are found:
1. Fix the issues immediately (do not defer)
2. Re-run validation to confirm fixes
3. Update validation.md with evidence
4. Commit the fixes

### 8. Update the changelog

Once the user is satisfied with the review, run the changelog skill:

```bash
python3 <path-to-changelog-skill>/scripts/changelog.py
```

This extracts all commits since the last CHANGELOG.md date and creates a new entry.

Then commit the updated CHANGELOG.md:
```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for spec review work"
```

### 9. Summary and next steps

Report to the user:
- All three reviews completed
- Key issues identified (if any)
- Validation execution results (with command output)
- Changelog updated with all branch commits
- Ready to merge or iterate

---

## Quality gates

- [ ] All three subagent reviews complete
- [ ] **ALL automated validation items executed and passed** (with actual command output)
- [ ] Consensus issues identified and discussed
- [ ] User confirmed readiness to proceed
- [ ] CHANGELOG.md updated
- [ ] Branch is clean (all changes committed)

---

## Constraints

### Non-Negotiable Rules

1. **Code is always runnable** — Never merge code that doesn't compile or start
2. **Shell commands are always available** — Use them to execute validation; never skip because "it looks fine"
3. **Automated validation is mandatory** — Any validation item that can be executed via command MUST be executed
4. **Document actual output** — Don't write "passed", record what actually ran and its output
5. **Fix don't skip** — If validation fails, fix the code. Don't mark it done.

### Guidelines

- Review findings are recommendations, not blockers — user owns final decisions
- Output review documents aid discussion but don't need to ship
- If shell execution is broken, report it immediately and do not skip validation
- Browser-only items (visual checks, cross-browser) are the only valid skip categories

### Technology-Agnostic Principles

These principles apply regardless of tech stack:
- **Compile/lint/typecheck** → Always run before claiming completeness
- **Test suite** → Always execute; no "tests passed locally" claims without evidence
- **Dev server startup** → Verify the application actually starts
- **API endpoints** → Test with actual HTTP requests
- **Database migrations** → Run and verify they complete successfully

---

## Related skills

- **spec-init**: Bootstrap specs foundation (mission, tech-stack, roadmap)
- **spec-create**: Create dated feature specs with requirements, plan, validation
- **changelog**: Update CHANGELOG.md from git history
