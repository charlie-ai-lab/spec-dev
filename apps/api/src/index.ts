import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'AgentClinic API' }))

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
