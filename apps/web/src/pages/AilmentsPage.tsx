import { useState } from 'react'
import { useAilments, useCreateAilment } from '../hooks/useAilments'
import { useAgents } from '../hooks/useAgents'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { FormInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { DataTable } from '../components/DataTable'
import { Badge } from '../components/Badge'
import type { Ailment } from '../hooks/useAgents'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

export function AilmentsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const { data: ailments, isLoading } = useAilments(
    { status: statusFilter || undefined, severity: severityFilter || undefined }
  )
  const { data: agents } = useAgents()
  const create = useCreateAilment()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<Partial<Ailment>>({ symptom: '', severity: 'medium', status: 'open', agentId: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.symptom || !form.severity || !form.agentId) {
      setError('Please fill in all required fields')
      return
    }
    try {
      await create.mutateAsync(form)
      setModalOpen(false)
      setForm({ symptom: '', severity: 'medium', status: 'open', agentId: '' })
      setError('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  if (isLoading) return <p className="text-slate-600">Loading...</p>

  const columns = [
    { header: 'Symptom', accessor: (a: Ailment) => a.symptom },
    { header: 'Severity', accessor: (a: Ailment) => <Badge>{a.severity}</Badge> },
    { header: 'Status', accessor: (a: Ailment) => <Badge>{a.status}</Badge> },
    {
      header: 'Agent',
      accessor: (a: Ailment) => {
        const agent = agents?.find((ag) => ag.id === a.agentId)
        return agent ? agent.name : a.agentId
      },
    },
    { header: 'Created', accessor: (a: Ailment) => new Date(a.createdAt).toLocaleString() },
    {
      header: 'Closed',
      accessor: (a: Ailment) => (a.closedAt ? new Date(a.closedAt).toLocaleString() : '—'),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Ailments</h2>
        <Button onClick={() => setModalOpen(true)}>Log Ailment</Button>
      </div>

      <div className="flex gap-4 mb-6">
        <FormSelect
          label="Status Filter"
          value={statusFilter}
          options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <FormSelect
          label="Severity Filter"
          value={severityFilter}
          options={[{ value: '', label: 'All Severities' }, ...severityOptions]}
          onChange={(e) => setSeverityFilter(e.target.value)}
        />
      </div>

      <DataTable columns={columns} rows={ailments || []} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Ailment">
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
          <FormInput label="Symptom" value={form.symptom || ''} onChange={(e) => setForm({ ...form, symptom: e.target.value })} required />
          <FormSelect
            label="Severity"
            value={form.severity || 'medium'}
            options={severityOptions}
            onChange={(e) => setForm({ ...form, severity: e.target.value as Ailment['severity'] })}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
