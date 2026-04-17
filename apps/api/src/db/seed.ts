import { v4 as uuidv4 } from 'uuid'
import { db } from './client'
import { agents } from './schema/agents'
import { ailments } from './schema/ailments'
import { therapies } from './schema/therapies'

const now = Date.now()

const agentData = [
  { id: uuidv4(), name: 'Alpha Bot', type: 'LLM', status: 'healthy', description: 'Primary conversational agent', createdAt: now - 1000 * 60 * 60 * 24 * 2 },
  { id: uuidv4(), name: 'Scraper One', type: 'Scraper', status: 'degraded', description: 'Web data collector', createdAt: now - 1000 * 60 * 60 * 24 },
]

async function seed() {
  await db.delete(therapies)
  await db.delete(ailments)
  await db.delete(agents)

  const insertedAgents = await db.insert(agents).values(agentData).returning()

  const ailmentData = [
    { id: uuidv4(), agentId: insertedAgents[1].id, symptom: 'Timeout on large pages', severity: 'medium', status: 'open', createdAt: now },
  ]

  const insertedAilments = await db.insert(ailments).values(ailmentData).returning()

  const therapyData = [
    { id: uuidv4(), agentId: insertedAgents[1].id, ailmentId: insertedAilments[0].id, method: 'restart', result: 'success', notes: 'Restarted after memory spike', createdAt: now },
  ]

  await db.insert(therapies).values(therapyData)

  console.log('Seed complete')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
