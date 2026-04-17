---
name: spec-done
description: Completes a spec development cycle after spec-review succeeds. Reads plan.md tasks and changelog, marks task completion status, extracts commit message, then executes git commit and merge to main. Trigger when user says "spec done", "complete spec", "finish feature", or after spec-review is confirmed complete.
---

# Spec Done

Completes the spec development workflow by comparing plan.md with changelog, creating commit message, and merging to main.

## Workflow

### 1. Find current branch and related spec

```bash
git branch --show-current
```

Find the corresponding `specs/` directory for this branch. The spec directory name matches the branch or feature context.

### 2. Read plan.md and CHANGELOG.md

Read the spec's `plan.md` to get the task list.
Read `CHANGELOG.md` to get completed work from this branch.

### 3. Compare and mark completion status

For each task in plan.md:
- Search CHANGELOG.md for evidence the task was completed
- Mark tasks as `[x]` (done) or `[ ]` (not done)
- Report any tasks without changelog evidence

### 4. Extract commit message from changelog

From CHANGELOG.md entry for this branch, extract:
- Feature/change summary (first line as title)
- Key changes as bullet points

Format as conventional commit:
```
<type>(<scope>): <subject>

<body with key changes>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### 5. Git commit and merge

```bash
# Commit all changes
git add -A
git commit -m "<commit message>"

# Merge to main
git checkout main
git merge <branch-name> --no-ff -m "<merge message>"

# Delete the feature branch
git branch -d <branch-name>
```

## Quality gates

- [ ] All plan.md tasks verified against changelog
- [ ] Commit message follows conventional commit format
- [ ] Merge to main successful
- [ ] Feature branch cleaned up

## Constraints

- Only run after spec-review is complete and user confirms
- If tasks are incomplete, report to user before proceeding
- Main branch name may vary (check `git branch -a` for `main` or `master`)
