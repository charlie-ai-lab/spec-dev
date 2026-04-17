import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/client'
import { agents } from '../db/schema/agents'
import { ailments } from '../db/schema/ailments'
import { therapies } from '../db/schema/therapies'
import { createAgentSchema, updateAgentSchema } from '../validators'

export const agentsRoute = new Hono()

agentsRoute.get('/', async (c) => {
  const status = c.req.query('status')
  let query = db.query.agents.findMany({
    orderBy: [desc(agents.createdAt)],
  })
  if (status) {
    query = db.query.agents.findMany({
      where: eq(agents.status, status),
      orderBy: [desc(agents.createdAt)],
    })
  }
  const results = await query
  return c.json(results)
})

agentsRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const agent = await db.query.agents.findFirst({
    where: eq(agents.id, id),
    with: {
      ailments: {
        orderBy: [desc(ailments.createdAt)],
      },
      therapies: {
        orderBy: [desc(therapies.createdAt)],
      },
    },
  })
  if (!agent) {
    return c.json({ error: 'Agent not found' }, 404)
  }
  return c.json(agent)
})

agentsRoute.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = createAgentSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors[0].message }, 400)
  }
  const agent = await db
    .insert(agents)
    .values({
      id: uuidv4(),
      ...parsed.data,
      createdAt: Date.now(),
    })
    .returning()
  return c.json(agent[0], 201)
})

agentsRoute.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = updateAgentSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: parsed.error.errors[0].message }, 400)
  }
  const updated = await db
    .update(agents)
    .set(parsed.data)
    .where(eq(agents.id, id))
    .returning()
  if (updated.length === 0) {
    return c.json({ error: 'Agent not found' }, 404)
  }
  return c.json(updated[0])
})

agentsRoute.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const deleted = await db.delete(agents).where(eq(agents.id, id)).returning()
  if (deleted.length === 0) {
    return c.json({ error: 'Agent not found' }, 404)
  }
  return c.json(deleted[0])
})
