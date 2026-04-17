import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export interface Agent {
  id: string
  name: string
  type: string
  status: 'healthy' | 'degraded' | 'offline'
  description?: string
  createdAt: number
  ailments?: Ailment[]
  therapies?: Therapy[]
}

export interface Ailment {
  id: string
  agentId: string
  symptom: string
  severity: 'low' | 'medium' | 'high'
  status: 'open' | 'closed'
  createdAt: number
  closedAt?: number | null
  agent?: Agent
}

export interface Therapy {
  id: string
  agentId: string
  ailmentId?: string | null
  method: string
  result: 'success' | 'failure' | 'in_progress'
  notes?: string
  createdAt: number
  agent?: Agent
  ailment?: Ailment
}

const AGENTS_KEY = 'agents'

export function useAgents(status?: string) {
  const query = status ? `?status=${status}` : ''
  return useQuery<Agent[]>({
    queryKey: [AGENTS_KEY, status],
    queryFn: () => api.get(`/agents${query}`),
  })
}

export function useAgent(id: string) {
  return useQuery<Agent>({
    queryKey: [AGENTS_KEY, id],
    queryFn: () => api.get(`/agents/${id}`),
    enabled: !!id,
  })
}

export function useCreateAgent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Agent>) => api.post<Agent>('/agents', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [AGENTS_KEY] }),
  })
}

export function useUpdateAgent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Agent> }) =>
      api.patch<Agent>(`/agents/${id}`, body),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [AGENTS_KEY] })
      qc.invalidateQueries({ queryKey: [AGENTS_KEY, vars.id] })
    },
  })
}

export function useDeleteAgent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.del<Agent>(`/agents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [AGENTS_KEY] }),
  })
}
