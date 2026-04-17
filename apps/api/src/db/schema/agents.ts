import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { ailments } from './ailments'
import { therapies } from './therapies'

export const agents = sqliteTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  description: text('description'),
  createdAt: integer('created_at').notNull(),
})

export const agentsRelations = relations(agents, ({ many }) => ({
  ailments: many(ailments),
  therapies: many(therapies),
}))
