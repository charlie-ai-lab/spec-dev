import { useState } from 'react'
import { useTherapies, useCreateTherapy } from '../hooks/useTherapies'
import { useAgents } from '../hooks/useAgents'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { FormInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { DataTable } from '../components/DataTable'
import { Badge } from '../components/Badge'
import type { Therapy } from '../hooks/useAgents'

const resultOptions = [
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'in_progress', label: 'In Progress' },
]

export function TherapiesPage() {
  const { data: therapies, isLoading } = useTherapies()
  const { data: agents } = useAgents()
  const create = useCreateTherapy()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Therapy>>({ method: '', result: 'in_progress', notes: '', agentId: '', ailmentId: undefined })
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.method || !form.result || !form.agentId) {
      setError('Please fill in all required fields')
      return
    }
    try {
      await create.mutateAsync(form)
      setModalOpen(false)
      setForm({ method: '', result: 'in_progress', notes: '', agentId: '', ailmentId: undefined })
      setError('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  if (isLoading) return <p className="text-slate-600">Loading...</p>

  const columns = [
    { header: 'Method', accessor: (t: Therapy) => t.method },
    { header: 'Result', accessor: (t: Therapy) => <Badge>{t.result}</Badge> },
    { header: 'Notes', accessor: (t: Therapy) => t.notes || '—' },
    {
      header: 'Agent',
      accessor: (t: Therapy) => {
        const agent = agents?.find((a) => a.id === t.agentId)
        return agent ? agent.name : t.agentId
      },
    },
    { header: 'Created', accessor: (t: Therapy) => new Date(t.createdAt).toLocaleString() },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Therapies</h2>
        <Button onClick={() => setModalOpen(true)}>Record Therapy</Button>
      </div>

      <DataTable columns={columns} rows={therapies || []} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Therapy">
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <FormSelect
            label="Agent"
            value={form.agentId || ''}
            options={[
              { value: '', label: 'Select Agent' },
              ...(agents || []).map((a) => ({ value: a.id, label: a.name })),
            ]}
            onChange={(e) => setForm({ ...form, agentId: e.target.value })}
          />
          <FormInput label="Method" value={form.method || ''} onChange={(e) => setForm({ ...form, method: e.target.value })} required />
          <FormSelect
            label="Result"
            value={form.result || 'in_progress'}
            options={resultOptions}
            onChange={(e) => setForm({ ...form, result: e.target.value as Therapy['result'] })}
          />
          <FormInput label="Notes" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
