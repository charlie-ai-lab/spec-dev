import { describe, it, expect, beforeEach } from 'vitest'
import { createTestApp } from './setup'

describe('API', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>['app']

  beforeEach(async () => {
    const testApp = await createTestApp()
    app = testApp.app
  })

  describe('POST /agents', () => {
    it('returns 201 and created object with UUID id', async () => {
      const res = await app.request('/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Agent',
          type: 'LLM',
          status: 'healthy',
          description: 'A test agent',
        }),
      })
      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      expect(body.name).toBe('Test Agent')
    })
  })

  describe('GET /agents/:id', () => {
    it('returns 200 with ailments and therapies arrays', async () => {
      const createRes = await app.request('/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Agent X', type: 'RPA', status: 'healthy' }),
      })
      const agent = await createRes.json()

      const res = await app.request(`/agents/${agent.id}`)
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.ailments).toEqual([])
      expect(body.therapies).toEqual([])
    })
  })

  describe('POST /ailments', () => {
    it('returns 400 for invalid severity', async () => {
      const agentRes = await app.request('/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Agent Y', type: 'Scraper', status: 'healthy' }),
      })
      const agent = await agentRes.json()

      const res = await app.request('/ailments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          symptom: 'Crash',
          severity: 'critical',
        }),
      })
      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBeDefined()
    })
  })

  describe('PATCH /ailments/:id', () => {
    it('sets closedAt when status changes to closed', async () => {
      const agentRes = await app.request('/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Agent Z', type: 'LLM', status: 'healthy' }),
      })
      const agent = await agentRes.json()

      const ailmentRes = await app.request('/ailments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          symptom: 'Latency',
          severity: 'medium',
        }),
      })
      const ailment = await ailmentRes.json()
      expect(ailment.closedAt).toBeNull()

      const res = await app.request(`/ailments/${ailment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.closedAt).not.toBeNull()
    })
  })

  describe('POST /therapies', () => {
    it('returns 404 for non-existent agentId', async () => {
      const res = await app.request('/therapies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: '00000000-0000-0000-0000-000000000000',
          method: 'restart',
          result: 'success',
        }),
      })
      expect(res.status).toBe(404)
      const body = await res.json()
      expect(body.error).toBe('Agent not found')
    })
  })

  describe('DELETE /agents/:id', () => {
    it('cascades and removes ailments and therapies', async () => {
      const agentRes = await app.request('/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Agent Cascade', type: 'LLM', status: 'healthy' }),
      })
      const agent = await agentRes.json()

      const ailmentRes = await app.request('/ailments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          symptom: 'Error',
          severity: 'high',
        }),
      })
      const ailment = await ailmentRes.json()

      await app.request('/therapies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          ailmentId: ailment.id,
          method: 'restart',
          result: 'success',
        }),
      })

      const deleteRes = await app.request(`/agents/${agent.id}`, { method: 'DELETE' })
      expect(deleteRes.status).toBe(200)

      const getRes = await app.request(`/agents/${agent.id}`)
      expect(getRes.status).toBe(404)
    })
  })
})
