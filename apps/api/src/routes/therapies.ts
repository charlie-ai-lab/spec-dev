import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/client'
import { agents } from '../db/schema/agents'
import { therapies } from '../db/schema/therapies'
import { createTherapySchema, updateTherapySchema } from '../validators'

export const therapiesRoute = new Hono()

therapiesRoute.get('/', async (c) => {
  const results = await db.query.therapies.findMany({
    with: { agent: true, ailment: true },
    orderBy: [desc(therapies.createdAt)],
  })
  return c.json(results)
})

therapiesRoute.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createTherapySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors[0].message }, 400)
  }
  const agent = await db.query.agents.findFirst({
    where: eq(agents.id, parsed.data.agentId),
  })
  if (!agent) {
    return c.json({ error: 'Agent not found' }, 404)
  }
  const therapy = await db
    .insert(therapies)
    .values({
      id: uuidv4(),
      ...parsed.data,
      createdAt: Date.now(),
    })
    .returning()
  return c.json(therapy[0], 201)
})

therapiesRoute.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = updateTherapySchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors[0].message }, 400)
  }
  const updated = await db
    .update(therapies)
    .set(parsed.data)
    .where(eq(therapies.id, id))
    .returning()
  if (updated.length === 0) {
    return c.json({ error: 'Therapy not found' }, 404)
  }
  return c.json(updated[0])
})
