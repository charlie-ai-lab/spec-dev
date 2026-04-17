import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Ailment } from './useAgents'

const AILMENTS_KEY = 'ailments'

export function useAilments(filters?: { status?: string; severity?: string }) {
  return useQuery<Ailment[]>({
    queryKey: [AILMENTS_KEY, filters],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.severity) params.append('severity', filters.severity)
      const qs = params.toString()
      return api.get<Ailment[]>(`/ailments${qs ? `?${qs}` : ''}`)
    },
  })
}

export function useCreateAilment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Ailment>) => api.post<Ailment>('/ailments', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [AILMENTS_KEY] })
      qc.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

export function useUpdateAilment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Ailment> }) =>
      api.patch<Ailment>(`/ailments/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [AILMENTS_KEY] })
      qc.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}
