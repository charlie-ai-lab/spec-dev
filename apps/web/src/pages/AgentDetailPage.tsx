import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAgent, type Ailment, type Therapy } from '../hooks/useAgents'
import { useCreateAilment, useUpdateAilment } from '../hooks/useAilments'
import { useCreateTherapy } from '../hooks/useTherapies'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Modal } from '../components/Modal'
import { FormInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { DataTable } from '../components/DataTable'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const therapyResultOptions = [
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'in_progress', label: 'In Progress' },
]

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: agent, isLoading } = useAgent(id || '')

  const createAilment = useCreateAilment()
  const createTherapy = useCreateTherapy()
  const updateAilment = useUpdateAilment()

  const agentId = agent!.id

  const [ailmentModal, setAilmentModal] = useState(false)
  const [therapyModal, setTherapyModal] = useState(false)
  const [ailmentForm, setAilmentForm] = useState<Partial<Ailment>>({ symptom: '', severity: 'medium', status: 'open' })
  const [therapyForm, setTherapyForm] = useState<Partial<Therapy>>({ method: '', result: 'in_progress', notes: '' })
  const [error, setError] = useState('')

  if (isLoading) return <p className="text-slate-600">Loading...</p>
  if (!agent) return <p className="text-slate-600">Agent not found.</p>

  async function submitAilment(e: React.FormEvent) {
    e.preventDefault()
    if (!ailmentForm.symptom || !ailmentForm.severity) return
    try {
      await createAilment.mutateAsync({ ...ailmentForm, agentId })
      setAilmentModal(false)
      setAilmentForm({ symptom: '', severity: 'medium', status: 'open' })
      setError('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function submitTherapy(e: React.FormEvent) {
    e.preventDefault()
    if (!therapyForm.method || !therapyForm.result) return
    try {
      await createTherapy.mutateAsync({ ...therapyForm, agentId })
      setTherapyModal(false)
      setTherapyForm({ method: '', result: 'in_progress', notes: '' })
      setError('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function closeAilment(ailment: Ailment) {
    await updateAilment.mutateAsync({ id: ailment.id, body: { status: 'closed' } })
  }

  const ailmentColumns = [
    { header: 'Symptom', accessor: (a: Ailment) => a.symptom },
    { header: 'Severity', accessor: (a: Ailment) => <Badge>{a.severity}</Badge> },
    { header: 'Status', accessor: (a: Ailment) => <Badge>{a.status}</Badge> },
    { header: 'Created', accessor: (a: Ailment) => new Date(a.createdAt).toLocaleString() },
    {
      header: 'Closed',
      accessor: (a: Ailment) => (a.closedAt ? new Date(a.closedAt).toLocaleString() : '—'),
    },
    {
      header: 'Actions',
      accessor: (a: Ailment) =>
        a.status === 'open' ? (
          <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => closeAilment(a)}>Close</Button>
        ) : (
          '—'
        ),
    },
  ]

  const therapyColumns = [
    { header: 'Method', accessor: (t: Therapy) => t.method },
    { header: 'Result', accessor: (t: Therapy) => <Badge>{t.result}</Badge> },
    { header: 'Notes', accessor: (t: Therapy) => t.notes || '—' },
    { header: 'Ailment', accessor: (t: Therapy) => (t.ailment ? t.ailment.symptom : '—') },
    { header: 'Created', accessor: (t: Therapy) => new Date(t.createdAt).toLocaleString() },
  ]

  return (
    <div>
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">&larr; Back</Button>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{agent.name}</h2>
        <div className="mt-2 flex items-center space-x-4">
          <Badge>{agent.status}</Badge>
          <span className="text-slate-600">Type: {agent.type}</span>
          <span className="text-slate-600">Created: {new Date(agent.createdAt).toLocaleString()}</span>
        </div>
        {agent.description && <p className="mt-4 text-slate-700">{agent.description}</p>}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Ailments</h3>
          <Button onClick={() => setAilmentModal(true)}>Log Ailment</Button>
        </div>
        <DataTable columns={ailmentColumns} rows={agent.ailments || []} />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Therapies</h3>
          <Button onClick={() => setTherapyModal(true)}>Record Therapy</Button>
        </div>
        <DataTable columns={therapyColumns} rows={agent.therapies || []} />
      </div>

      <Modal open={ailmentModal} onClose={() => setAilmentModal(false)} title="Log Ailment">
        <form onSubmit={submitAilment}>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <FormInput label="Symptom" value={ailmentForm.symptom || ''} onChange={(e) => setAilmentForm({ ...ailmentForm, symptom: e.target.value })} required />
          <FormSelect label="Severity" value={ailmentForm.severity || 'medium'} options={severityOptions} onChange={(e) => setAilmentForm({ ...ailmentForm, severity: e.target.value as Ailment['severity'] })} />
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setAilmentModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal open={therapyModal} onClose={() => setTherapyModal(false)} title="Record Therapy">
        <form onSubmit={submitTherapy}>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <FormSelect
            label="Linked Ailment (optional)"
            value={therapyForm.ailmentId || ''}
            options={[{ value: '', label: '— None —' }, ...(agent.ailments || []).map((a) => ({ value: a.id, label: a.symptom }))]}
            onChange={(e) => setTherapyForm({ ...therapyForm, ailmentId: e.target.value || null })}
          />
          <FormInput label="Method" value={therapyForm.method || ''} onChange={(e) => setTherapyForm({ ...therapyForm, method: e.target.value })} required />
          <FormSelect label="Result" value={therapyForm.result || 'in_progress'} options={therapyResultOptions} onChange={(e) => setTherapyForm({ ...therapyForm, result: e.target.value as Therapy['result'] })} />
          <FormInput label="Notes" value={therapyForm.notes || ''} onChange={(e) => setTherapyForm({ ...therapyForm, notes: e.target.value })} />
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setTherapyModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
