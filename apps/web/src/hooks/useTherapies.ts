import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Therapy } from './useAgents'

const THERAPIES_KEY = 'therapies'

export function useTherapies() {
  return useQuery<Therapy[]>({
    queryKey: [THERAPIES_KEY],
    queryFn: () => api.get('/therapies'),
  })
}

export function useCreateTherapy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<Therapy>) => api.post<Therapy>('/therapies', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [THERAPIES_KEY] })
      qc.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}

export function useUpdateTherapy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Therapy> }) =>
      api.patch<Therapy>(`/therapies/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [THERAPIES_KEY] })
      qc.invalidateQueries({ queryKey: ['agents'] })
    },
  })
}
