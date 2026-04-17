import { z } from 'zod'

export const agentStatusEnum = z.enum(['healthy', 'degraded', 'offline'])
export const severityEnum = z.enum(['low', 'medium', 'high'])
export const ailmentStatusEnum = z.enum(['open', 'closed'])
export const therapyResultEnum = z.enum(['success', 'failure', 'in_progress'])

export const createAgentSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  status: agentStatusEnum,
  description: z.string().optional(),
})

export const updateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  status: agentStatusEnum.optional(),
  description: z.string().optional(),
})

export const createAilmentSchema = z.object({
  agentId: z.string().uuid(),
  symptom: z.string().min(1),
  severity: severityEnum,
  status: ailmentStatusEnum.default('open'),
})

export const updateAilmentSchema = z.object({
  symptom: z.string().min(1).optional(),
  severity: severityEnum.optional(),
  status: ailmentStatusEnum.optional(),
})

export const createTherapySchema = z.object({
  agentId: z.string().uuid(),
  ailmentId: z.string().uuid().optional(),
  method: z.string().min(1),
  result: therapyResultEnum,
  notes: z.string().optional(),
})

export const updateTherapySchema = z.object({
  method: z.string().min(1).optional(),
  result: therapyResultEnum.optional(),
  notes: z.string().optional(),
})
