import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent, type Agent } from '../hooks/useAgents'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { FormInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { DataTable } from '../components/DataTable'
import { Badge } from '../components/Badge'

const statusOptions = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'offline', label: 'Offline' },
]

const emptyAgent: Partial<Agent> = { name: '', type: '', status: 'healthy', description: '' }

export function AgentsPage() {
  const { data: agents, isLoading } = useAgents()
  const create = useCreateAgent()
  const update = useUpdateAgent()
  const del = useDeleteAgent()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Agent | null>(null)
  const [form, setForm] = useState<Partial<Agent>>(emptyAgent)
  const [error, setError] = useState('')

  function openCreate() {
    setEditing(null)
    setForm(emptyAgent)
    setError('')
    setModalOpen(true)
  }

  function openEdit(agent: Agent) {
    setEditing(agent)
    setForm({ ...agent })
    setError('')
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.type || !form.status) {
      setError('Please fill in all required fields')
      return
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, body: form })
      } else {
        await create.mutateAsync(form)
      }
      setModalOpen(false)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this agent?')) return
    await del.mutateAsync(id)
  }

  if (isLoading) return <p className="text-slate-600">Loading...</p>

  const columns = [
    { header: 'Name', accessor: (a: Agent) => <Link to={`/agents/${a.id}`} className="text-primary-600 hover:underline font-medium">{a.name}</Link> },
    { header: 'Type', accessor: (a: Agent) => a.type },
    { header: 'Status', accessor: (a: Agent) => <Badge>{a.status}</Badge> },
    { header: 'Created', accessor: (a: Agent) => new Date(a.createdAt).toLocaleString() },
    {
      header: 'Actions',
      accessor: (a: Agent) => (
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => openEdit(a)} className="px-2 py-1 text-xs">Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(a.id)} className="px-2 py-1 text-xs">Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Agents</h2>
        <Button onClick={openCreate}>Add Agent</Button>
      </div>
      <DataTable columns={columns} rows={agents || []} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Agent' : 'Add Agent'}>
        <form onSubmit={handleSubmit}>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
          <FormInput label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FormInput label="Type" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
          <FormSelect label="Status" value={form.status || 'healthy'} options={statusOptions} onChange={(e) => setForm({ ...form, status: e.target.value as Agent['status'] })} />
          <FormInput label="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
