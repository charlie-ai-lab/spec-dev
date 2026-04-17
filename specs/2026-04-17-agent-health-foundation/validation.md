# Phase 1: Agent Health Foundation — Validation

## Automated Checks

### Type Safety
- [x] `tsc --noEmit` passes in `apps/api` with zero errors.
- [x] `tsc --noEmit` passes in `apps/web` with zero errors.

### Lint & Format
- [x] `pnpm lint` completes without errors in both apps.
- [x] `pnpm format` produces no diffs.

### Backend Tests
- [x] `vitest run` in `apps/api` passes all 6 test suites.

### API Manual Tests (via curl with `pnpm dev` running)
- [x] `GET /health` returns 200 `{"status":"ok"}`
- [x] `POST /agents` returns 201 with UUID id
- [x] `GET /agents/:id` returns 200 with ailments and therapies arrays
- [x] `POST /ailments` with invalid severity returns 400 with human-readable error
- [x] `POST /therapies` with non-existent agentId returns 404
- [x] `PATCH /ailments/:id` with `status: "closed"` sets `closedAt` to non-null timestamp
- [x] `DELETE /agents/:id` cascades and removes related ailments and therapies

### Edge Case Tests
- [x] `GET /agents/non-existent-id` returns 404 `{"error":"Agent not found"}`
- [x] Empty string validation returns 400 with human-readable error
- [x] Invalid enum value returns 400 with specific allowed values shown

## Manual Walkthrough (Browser Required)

> These items require visual confirmation in a browser and cannot be automated.

### Frontend E2E Flow
1. Run `pnpm dev` from project root.
2. Open `http://localhost:5173`.
3. **Agent onboarding**: Click "Add Agent", fill form, submit, verify in table.
4. **Ailment logging**: Navigate to agent detail, click "Log Ailment", submit.
5. **Therapy recording**: Click "Record Therapy", select ailment, submit.
6. **Ailment closure**: Edit ailment, change status to "closed", verify timestamp.
7. **Agent deletion**: Delete agent, verify cascade removal in UI.

### Edge Cases (Visual Check)
- [ ] Empty form submission shows validation errors inline.
- [ ] Duplicate agent names are allowed (no unique constraint).
- [ ] Navigating to `/agents/non-existent-id` shows "Not Found" message.

### Tone & Copy (Visual Check)
- [ ] Labels consistent: "Log Ailment", "Record Therapy", "Agent"
- [ ] Error messages are human-readable
- [ ] No placeholder text like "lorem ipsum"

## Definition of Done

- [x] All automated checks pass.
- [x] API manual tests pass (verified via curl).
- [ ] Manual frontend walkthrough completes without errors.
- [ ] Dashboard renders correctly in Chrome, Firefox, and Edge.
- [ ] Operator can register an agent, log an ailment, and record a therapy in under 2 minutes.
- [x] Code is committed to the `phase-1-agent-health-foundation` branch.
