import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AgentsPage } from './pages/AgentsPage'
import { AgentDetailPage } from './pages/AgentDetailPage'
import { AilmentsPage } from './pages/AilmentsPage'
import { TherapiesPage } from './pages/TherapiesPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AgentsPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/agents/:id" element={<AgentDetailPage />} />
        <Route path="/ailments" element={<AilmentsPage />} />
        <Route path="/therapies" element={<TherapiesPage />} />
      </Routes>
    </Layout>
  )
}

export default App
