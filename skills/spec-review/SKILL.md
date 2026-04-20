---
name: spec-review
description: Performs a deep multi-perspective review of spec and code changes on the current branch. Spawns review subagents to examine changes from architecture, requirements, feasibility, and code quality angles (code quality delegated to a dedicated code-reviewer agent), then updates the changelog. Trigger when the user says "spec review", "review specs", "deep review", or invokes /spec-review.
---

# Spec Review

## Workflow

### 1. Verify git state

Check that you're on a feature/spec branch (not main/master):
```bash
git branch --show-current
```

If on main/master, ask the user to checkout the feature branch first.

### 2. Identify changed files

Get the list of all modified files on this branch:
```bash
git diff --name-only origin/main HEAD
```

Categorize them:
- **Spec files**: `specs/` and related documentation — for architecture, requirements, feasibility reviews
- **Code files**: Source code, tests, config — for code quality review

Store both lists; code quality review needs the code file paths.

### 3. Spawn review subagents — FOUR parallel reviews

Use `runSubagent` to spawn **four independent review perspectives**:

#### Subagent 1: Architecture & Tech Review
**Purpose**: Examine if tech decisions are sound, internally consistent, and aligned with constraints.

**Input context**:
- Current branch name
- List of changed spec files
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
- List of changed spec files
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
- List of changed spec files
- Tech stack from specs/tech-stack.md
- Instruction: "Review all spec changes for implementation feasibility. Check:
  - Task breakdown is detailed enough for execution
  - Effort estimates are realistic
  - Dependencies between tasks are clear
  - No hidden complexity or risky assumptions
  - Anything that could derail execution"

**Output**: FEASIBILITY_REVIEW.md with findings, risks, and recommendations

#### Subagent 4: Code Quality Review
**Purpose**: Delegate code quality inspection to a specialized code reviewer. Do **not** perform this review yourself.

**How to delegate**: Spawn the `code-reviewer` agent (eg: `oh-my-claudecode:code-reviewer`) with the following context:

**Input context for code-reviewer agent**:
- Current branch name
- List of changed code files (from Step 2)
- Full diff of code changes: `git diff origin/main HEAD -- <code-files>`
- Instruction: "Perform a code quality review on the implementation changes in this branch. Focus on:
  - Coding standards and style consistency
  - Logic correctness and potential bugs
  - Security vulnerabilities (injection, XSS, unsafe patterns)
  - Test coverage for new code
  - Performance implications
  - Readability and maintainability
  - Error handling completeness
  - OWASP Top 10 risks"

**Output**: CODE_QUALITY_REVIEW.md with severity-rated findings, logic defects, and recommendations

**Why delegate?** Code review is a deep specialized task best handled by a dedicated reviewer agent. The spec-review skill orchestrates the review pipeline but should not attempt to replace domain expertise in code quality analysis.

### 4. Collect and synthesize findings

Review the four output documents (ARCHITECTURE_REVIEW.md, REQUIREMENTS_REVIEW.md, FEASIBILITY_REVIEW.md, CODE_QUALITY_REVIEW.md). Identify:
- **Consensus issues**: Problems flagged by multiple reviewers (≥2) → High priority
- **Security/quality blockers**: Severity-rated issues from CODE_QUALITY_REVIEW.md → Must address before merge
- **Single-perspective issues**: One reviewer's concern → Discuss with user
- **Improvements**: Suggestions that enhance clarity/quality

When presenting to the user, structure the summary as:
1. **Code Quality & Security** (from CODE_QUALITY_REVIEW.md) — list severity-rated findings first
2. **Architecture & Feasibility** (cross-reference ARCHITECTURE_REVIEW.md + FEASIBILITY_REVIEW.md)
3. **Requirements & Scope** (from REQUIREMENTS_REVIEW.md)

Ask the user:
```
I've completed a four-angle review of your branch (architecture, requirements, feasibility, code quality). Here are the findings:

[Synthesized summary with code quality/security issues listed first, then consensus issues]

Would you like to:
1. Address findings and iterate
2. Accept findings and move to changelog
3. Dive deeper on a specific concern
```

### 5. Update the changelog

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

### 6. Summary and next steps

Report to the user:
- All four reviews completed (architecture, requirements, feasibility, code quality)
- Key issues identified (if any), with code quality/security findings listed first
- Changelog updated with all branch commits
- Ready to merge or iterate

## Quality gates

- [ ] All four subagent reviews complete (including code quality review by dedicated code-reviewer agent)
- [ ] Consensus issues identified and discussed
- [ ] User confirmed readiness to proceed
- [ ] CHANGELOG.md updated
- [ ] Branch is clean (all changes committed)

## Constraints

- Must run on a feature branch (safety check)
- Review findings are recommendations, not blockers—user owns final decisions
- Changelog automation captures commit history accurately
- Output review documents aid discussion but don't need to ship

## Related skills

- **spec-init**: Bootstrap specs foundation (mission, tech-stack, roadmap)
- **feature-spec**: Create dated feature specs with requirements, plan, validation
- **changelog**: Update CHANGELOG.md from git history
