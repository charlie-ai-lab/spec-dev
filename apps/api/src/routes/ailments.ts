import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/client'
import { agents } from '../db/schema/agents'
import { ailments } from '../db/schema/ailments'
import { createAilmentSchema, updateAilmentSchema } from '../validators'

export const ailmentsRoute = new Hono()

ailmentsRoute.get('/', async (c) => {
  const results = await db.query.ailments.findMany({
    with: { agent: true },
    orderBy: [desc(ailments.createdAt)],
  })
  return c.json(results)
})

ailmentsRoute.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createAilmentSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors[0].message }, 400)
  }
  const agent = await db.query.agents.findFirst({
    where: eq(agents.id, parsed.data.agentId),
  })
  if (!agent) {
    return c.json({ error: 'Agent not found' }, 404)
  }
  const ailment = await db
    .insert(ailments)
    .values({
      id: uuidv4(),
      ...parsed.data,
      createdAt: Date.now(),
      closedAt: null,
    })
    .returning()
  return c.json(ailment[0], 201)
})

ailmentsRoute.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = updateAilmentSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors[0].message }, 400)
  }
  const existing = await db.query.ailments.findFirst({
    where: eq(ailments.id, id),
  })
  if (!existing) {
    return c.json({ error: 'Ailment not found' }, 404)
  }
  const updates: Partial<typeof ailments.$inferInsert> = { ...parsed.data }
  if (parsed.data.status === 'closed' && existing.status !== 'closed') {
    updates.closedAt = Date.now()
  } else if (parsed.data.status === 'open') {
    updates.closedAt = null
  }
  const updated = await db
    .update(ailments)
    .set(updates)
    .where(eq(ailments.id, id))
    .returning()
  return c.json(updated[0])
})
