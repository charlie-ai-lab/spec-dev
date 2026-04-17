import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { agents } from './agents'
import { therapies } from './therapies'

export const ailments = sqliteTable('ailments', {
  id: text('id').primaryKey(),
  agentId: text('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  symptom: text('symptom').notNull(),
  severity: text('severity').notNull(),
  status: text('status').notNull(),
  createdAt: integer('created_at').notNull(),
  closedAt: integer('closed_at'),
})

export const ailmentsRelations = relations(ailments, ({ one, many }) => ({
  agent: one(agents, {
    fields: [ailments.agentId],
    references: [agents.id],
  }),
  therapies: many(therapies),
}))
