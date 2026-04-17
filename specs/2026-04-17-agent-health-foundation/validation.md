# Phase 1: Agent Health Foundation — Validation

## Automated Checks

### Type Safety
- [ ] `tsc --noEmit` passes in `apps/api` with zero errors.
- [ ] `tsc --noEmit` passes in `apps/web` with zero errors.

### Lint & Format
- [ ] `pnpm lint` completes without errors in both apps.
- [ ] `pnpm format` produces no diffs (all files are already formatted).

### Backend Tests
- [ ] `pnpm test` in `apps/api` passes all Vitest suites.
- [ ] Required assertions:
  - Creating an agent returns 201 and the created object with a UUID `id`.
  - Fetching an agent by ID returns 200 with `ailments` and `therapies` arrays.
  - Creating an ailment with an invalid `severity` value returns 400.
  - Closing an ailment (`PATCH /ailments/:id` with `status: "closed"`) sets `closedAt` to a non-null timestamp.
  - Creating a therapy with a non-existent `agentId` returns 404.
  - Deleting an agent cascades and removes its ailments and therapies.

### API Health Check
- [ ] `GET http://localhost:3001/health` (or root) responds with 200.

## Manual Walkthrough

### End-to-End Flow
1. Run `pnpm dev` from the project root.
2. Open `http://localhost:5173` (Vite dev server).
3. **Agent onboarding**:
   - Click "Add Agent".
   - Fill name, type, status, description; submit.
   - Verify the new agent appears in the agents table within 1 second.
4. **Ailment logging**:
   - Navigate to the new agent’s detail page.
   - Click "Log Ailment".
   - Enter symptom, choose severity, submit.
   - Verify the ailment appears under the agent with status "open".
5. **Therapy recording**:
   - Click "Record Therapy".
   - Select the ailment just created, choose method, result "in_progress", add notes, submit.
   - Verify the therapy appears in the therapies table with correct agent and ailment names.
6. **Ailment closure**:
   - Edit the ailment and change status to "closed".
   - Verify the status badge updates and a closed timestamp is shown.
7. **Agent deletion**:
   - Delete the agent from the agents list.
   - Verify the agent and all related ailments/therapies are removed from the UI.

### Edge Cases
- [ ] Submitting an empty form shows validation errors inline (no blank page or console crash).
- [ ] Attempting to create an agent with a duplicate name is allowed (no unique constraint on name).
- [ ] Navigating directly to `/agents/non-existent-id` shows a graceful "Not Found" message.

## Tone & Copy Check
- [ ] All user-facing labels are consistent: "Log Ailment" (not "Add Ailment"), "Record Therapy" (not "Add Therapy"), "Agent" (not "User" or "Patient").
- [ ] Error messages are human-readable (e.g., "Severity must be low, medium, or high").
- [ ] No placeholder text like "lorem ipsum" remains in the UI.

## Definition of Done

- [ ] All automated checks pass.
- [ ] Manual walkthrough completes without errors.
- [ ] Dashboard renders correctly in Chrome, Firefox, and Edge (latest versions).
- [ ] Operator can register an agent, log an ailment, and record a therapy in under 2 minutes.
- [ ] Code is committed to the `phase-1-agent-health-foundation` branch.
