---
name: spec-review
description: Performs a deep multi-perspective review of spec changes on the current branch. Spawns multiple review subagents to examine changes from architecture, implementation, and requirements angles, then updates the changelog. Trigger when the user says "spec review", "review specs", "deep review", or invokes /spec-review.
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

Get the list of modified spec files on this branch:
```bash
git diff --name-only origin/main HEAD
```

Focus on files in `specs/` and related documentation.

### 3. Spawn review subagents — THREE parallel reviews

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

### 4. Collect and synthesize findings

Review the three output documents. Identify:
- **Consensus issues**: Problems all three reviewers flagged → High priority
- **Single-perspective issues**: One reviewer's concern → Discuss with user
- **Improvements**: Suggestions that enhance clarity/quality

Ask the user:
```
I've completed a three-angle review of your spec changes. Here are the findings:

[Synthesized summary of all three reviews with consensus issues listed first]

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
- All three reviews completed
- Key issues identified (if any)
- Changelog updated with all branch commits
- Ready to merge or iterate

## Quality gates

- [ ] All three subagent reviews complete
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
