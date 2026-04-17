import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export async function createTestApp() {
  process.env.DATABASE_URL = ':memory:'

  const { db } = await import('../db/client')
  migrate(db, { migrationsFolder: './apps/api/src/db/migrations' })

  const [{ agentsRoute }, { ailmentsRoute }, { therapiesRoute }] = await Promise.all([
    import('../routes/agents'),
    import('../routes/ailments'),
    import('../routes/therapies'),
  ])

  const app = new Hono()
  app.use(cors())
  app.get('/health', (c) => c.json({ status: 'ok' }))
  app.route('/agents', agentsRoute)
  app.route('/ailments', ailmentsRoute)
  app.route('/therapies', therapiesRoute)

  return { app, db }
}
