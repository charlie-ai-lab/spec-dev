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

6. **Mark task complete**:
   Update plan.md to check off the task:
   ```markdown
   - [x] Task 1 name
   ```
   Commit: `docs(spec): mark task 1 complete`

### 5. Feature group completion

Once all tasks in a group are complete:
- Summarize what was delivered in that group
- Ask user: "Ready to move to the next group?" or "Do you want to pause here?"
- If pausing, create a checkpoint commit: `checkpoint: feature group <N> complete`

### ⚠️ MANDATORY: Validation Gate

**NO feature group may be marked complete, and the spec is NOT done until Step 6 (validation) passes.**

Skipping validation is a constraint violation. If the user tries to end the session before validation:
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

Run the changelog skill:

```bash
python3 <path-to-changelog-skill>/scripts/changelog.py
```

This extracts all commits on the feature branch and creates a dated entry.

Commit:
```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for spec implementation"
```

**Without this commit, the spec is incomplete.**

### 8. Summary and merge readiness

**Precondition: Steps 6 and 7 must be complete before showing success.**

If all checks passed and changelog is updated, report:
```
✅ Spec Implementation Complete

Feature: [Spec Name]
Branch: [feature-branch]
Commits: [N]
Tests: All passing ✅
Validation: All checks passed ✅
Changelog: Updated ✅

Ready to merge!

Next steps:
1. Run final code review
2. Merge to main
3. Deploy
```

If validation or changelog is pending:
```
❌ Spec Implementation Incomplete

Validation: [Status]
Changelog: [Status]

Cannot mark as complete until Steps 6 and 7 are finished.
```

Suggest: "Shall I create a summary report for the merge commit?"

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

## Related skills

- **spec-create**: Create a new feature spec with user interview
- **spec-mvp**: Define and execute MVP scope
- **spec-review**: Deep multi-perspective review of spec changes
- **changelog**: Maintain CHANGELOG.md from git history
