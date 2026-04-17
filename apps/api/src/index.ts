import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { agentsRoute } from './routes/agents'
import { ailmentsRoute } from './routes/ailments'
import { therapiesRoute } from './routes/therapies'

const app = new Hono()

app.use(logger())
app.use(cors({ origin: 'http://localhost:5173' }))

app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/agents', agentsRoute)
app.route('/ailments', ailmentsRoute)
app.route('/therapies', therapiesRoute)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

app.notFound((c) => c.json({ error: 'Not found' }, 404))

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})

export default app
