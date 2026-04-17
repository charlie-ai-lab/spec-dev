import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'
import { agents } from './agents'
import { ailments } from './ailments'

export const therapies = sqliteTable('therapies', {
  id: text('id').primaryKey(),
  agentId: text('agent_id')
    .notNull()
    .references(() => agents.id, { onDelete: 'cascade' }),
  ailmentId: text('ailment_id').references(() => ailments.id, { onDelete: 'cascade' }),
  method: text('method').notNull(),
  result: text('result').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at').notNull(),
})

export const therapiesRelations = relations(therapies, ({ one }) => ({
  agent: one(agents, {
    fields: [therapies.agentId],
    references: [agents.id],
  }),
  ailment: one(ailments, {
    fields: [therapies.ailmentId],
    references: [ailments.id],
  }),
}))
