---
name: spec-do
description: Executes a feature spec by finding the latest dated spec directory, reading plan.md and validation.md, implementing tasks incrementally with branch-per-task workflow, running validations, and updating the changelog. Trigger when the user says "spec do", "execute spec", "implement spec", "start implementation", or invokes /spec-do.
---

# Spec Do

## Workflow

### 1. Locate the latest spec directory

List all dated spec directories in `specs/` matching pattern `YYYY-MM-DD-*`:

```bash
ls -d specs/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*
```

Find the most recent one. If multiple exist, ask the user which spec to execute:
```
Found multiple specs. Which would you like to execute?
- specs/2026-04-17-request-assessment
- specs/2026-04-15-clarification-guide
```

### 2. Read the spec files

Load and parse:
- `specs/<SPEC>/plan.md` — Task breakdown with acceptance criteria
- `specs/<SPEC>/requirements.md` — Scope and decisions for context
- `specs/<SPEC>/validation.md` — Automated & manual validation checklist

### 3. Check git state

Ensure you're on the feature branch:
```bash
git branch --show-current
```

Determine the base branch (the branch this spec will merge into — e.g. `main`, `mvp`, `develop`):
- Check `git log --oneline --graph --decorate | head -n 10` for branch relationships
- Or ask the user: "What is the target branch for this spec? (main / mvp / other)"
- Record it as `<base-branch>` for use in merge steps

If not on the feature branch (should be `phase-N-<kebab-name>` or similar), ask the user to checkout the correct branch first.

### 4. Execute tasks incrementally

For each **task group** in plan.md:

#### 4a. Display the group

Show the user:
```
## Feature Group: [Group Name]
[Group description from plan.md]

Tasks to complete:
1. [Task 1 name]
   - Acceptance: [acceptance criteria]
   - Effort: [S/M/L]
   
2. [Task 2 name]
   - Acceptance: [acceptance criteria]
   - Effort: [S/M/L]
```

#### 4b. Execute each task

For each task:

1. **Create task branch**:
   ```bash
   git checkout -b <feature-branch>-task-<N>-<kebab-name>
   ```

2. **Implement the task**:
   - Work with the user to write code, create files, etc.
   - Reference requirements.md for scope and decisions
   - Ask clarifying questions if acceptance criteria are ambiguous

3. **Run interim validation**:
   - Compile / typecheck (if applicable)
   - Run task-specific tests
   - Verify acceptance criteria are met

4. **Commit the work**:
   ```bash
   git add .
   git commit -m "feat(spec): <task name>"
   ```

5. **Merge back to feature branch**:
   ```bash
   git checkout <feature-branch>
   git merge --no-ff <feature-branch>-task-<N>-<kebab-name>
   ```

6. **Delete merged task branch** (REQUIRED):
   ```bash
   git branch -d <feature-branch>-task-<N>-<kebab-name>
   ```
   **Task branches must be deleted immediately after merge. No exceptions.**

7. **Mark task complete**:
   Update plan.md to check off the task:
   ```markdown
   - [x] Task 1 name
   ```
   Commit: `docs(spec): mark task 1 complete`

### 5. Feature group completion (MANDATORY)

**Once all tasks in a group are complete, the group is NOT done until steps 5a–5d below are fully executed.**

#### 5a. Verify group integration

Before marking the group complete, confirm:
- [ ] All tasks in this group are checked off in `plan.md`
- [ ] All task branches have been merged into the feature branch
- [ ] No uncommitted changes remain on the feature branch

Run group-level validation:
```bash
npm run typecheck        # or equivalent
npm run lint             # if configured
npm test -- --testPathPattern=<group-scope>   # group-relevant tests
```

**Any failure blocks the group. Fix before proceeding.**

#### 5b. Commit group completion (REQUIRED)

Create a structured completion commit on the feature branch:

```bash
git add .
git commit -m "feat(spec): complete group <N> - <group-name>"
```

Commit body template (include in the commit message):
```
feat(spec): complete group <N> - <group-name>

- Task 1: <brief description>
- Task 2: <brief description>
- ...

Validation: typecheck pass, lint pass, tests pass
```

**Without this commit, the group is incomplete.**

#### 5c. Merge group to base branch (REQUIRED)

Merge the feature branch (containing the completed group) into `<base-branch>`:

```bash
git checkout <base-branch>
git pull origin <base-branch>
git merge --no-ff <feature-branch> -m "merge(group): integrate group <N> - <group-name>"
git push origin <base-branch>
git checkout <feature-branch>
```

**Merge is MANDATORY. A group is not considered complete until it is merged into the base branch.**

If merge conflicts occur:
1. Resolve conflicts on the feature branch first
2. Re-run group validation (Step 5a)
3. Re-commit if needed
4. Retry merge

#### 5d. Confirm and continue

Report to the user:
```
✅ Group <N> Complete: <group-name>

Delivered:
- [Task 1 name]
- [Task 2 name]
- ...

Git:
- Commit: feat(spec): complete group <N> - <group-name>
- Merge:  <feature-branch> → <base-branch>

Validation:
- Typecheck: ✅
- Lint:      ✅
- Tests:     ✅
```

Then ask:
> "Ready to move to the next group?" or "Do you want to pause here?"

If pausing, note the pause point in plan.md (e.g., `<!-- Paused after Group 2 -->`).

### ⚠️ MANDATORY: Validation Gates

**Two validation gates exist:**

1. **Group Gate (Step 5a)**: No group may proceed to the next group until group-level validation (typecheck, lint, tests) passes.
2. **Final Gate (Step 6)**: The spec is NOT done until full validation (automated + manual) passes.

Skipping either validation is a constraint violation. If the user tries to end the session before validation:
> "Validation has not been run yet. Spec implementation is incomplete until all checks pass."

---

### 6. Run full validation

Once all feature groups are complete, run validation from `specs/<SPEC>/validation.md`:

**Prerequisite: All feature groups must be complete before running validation.**

#### 6a. Automated validation
```bash
npm test                    # Run project test suite
npm run typecheck           # TypeScript or equivalent
npm run lint               # Linting
npm run build              # Build check
```

Report results:
- All checks passing: ✅
- Any failures: ❌ — show errors and ask user to fix

#### 6b. Manual validation

For each manual validation step in validation.md:
- Display the scenario
- Ask user to verify it works
- Example: "Walkthrough: Create a new request, verify it's scored correctly, check the UI shows results"

Record:
```
Manual validation checklist:
- [ ] Scenario 1
- [ ] Scenario 2
- [ ] Edge case handling
- [ ] Tone/UX coherence
```

#### 6c. Definition of done

**All items must be checked before the spec is considered complete.**

```
Definition of Done Checklist:
- [ ] All feature groups completed
- [ ] All groups merged to base branch (Step 5c)
- [ ] All task branches deleted after merge
- [ ] All automated tests pass
- [ ] All manual validation passed
- [ ] Code reviewed (if applicable)
- [ ] CHANGELOG.md updated          ← Required by Step 7
- [ ] No breaking changes introduced
```

**If any item is unchecked, the spec is NOT complete. Do not report success.**

---

### 7. Update changelog

**⚠️ MANDATORY: Changelog update is required to complete the spec.**

Since all groups have been merged to the base branch, checkout `<base-branch>` and update:

```bash
git checkout <base-branch>
python3 <path-to-changelog-skill>/scripts/changelog.py
```

This extracts all commits from the base branch and creates a dated entry.

Commit and push:
```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for spec implementation"
git push origin <base-branch>
git checkout <feature-branch>
```

**Without this commit, the spec is incomplete.**

### 8. Final summary

**Precondition: Steps 6 and 7 must be complete before showing success.**

Since each group was already merged to the base branch in Step 5c, the final step is confirmation.

If all checks passed and changelog is updated, report:
```
✅ Spec Implementation Complete

Feature: [Spec Name]
Branch: [feature-branch]
Groups: [N] completed and merged to <base-branch>
Task branches: All deleted ✅
Commits: [N]
Tests: All passing ✅
Validation: All checks passed ✅
Changelog: Updated ✅

All deliverables are on <base-branch>. No further merge needed.

Next steps:
1. Run final code review (if applicable)
2. Deploy
```

If validation or changelog is pending:
```
❌ Spec Implementation Incomplete

Validation: [Status]
Changelog: [Status]

Cannot mark as complete until Steps 6 and 7 are finished.
```

Suggest: "Shall I create a summary report for this spec implementation?"

## Task workflow detail

Each task follows this pattern:
```
Task: [Name]
Acceptance Criteria:
  - [Criterion 1]
  - [Criterion 2]
  - [Criterion 3]

Status: [ ] Not started → [ ] In progress → [ ] Review → [x] Complete
```

The user implements the code; this skill orchestrates branching, testing, validation, and commit management.

## Checkpoints and recovery

If a task fails validation:
- Ask the user: "Fix the issue and I'll re-run validation, or shall we discuss the problem?"
- Offer options:
  1. **Retry**: Fix the code, re-run validation
  2. **Adjust criteria**: Update acceptance criteria if they were unrealistic
  3. **Defer**: Move to next task, mark this as "blocked" for later
  4. **Escalate**: Discuss the blocker and decide on direction

## Constraints

- Respect the tech stack from `specs/tech-stack.md`
- Follow all decisions in `specs/<SPEC>/requirements.md`
- Do not modify acceptance criteria without user approval
- Each task should be independently shippable
- All commits must pass validation before moving forward
- **Each completed group MUST have a group completion commit (Step 5b) and MUST be merged to the base branch (Step 5c)**
- **All merged task branches MUST be deleted immediately after merge (Step 4b.6)**

## Related skills

- **spec-create**: Create a new feature spec with user interview
- **spec-mvp**: Define and execute MVP scope
- **spec-review**: Deep multi-perspective review of spec changes
- **changelog**: Maintain CHANGELOG.md from git history
