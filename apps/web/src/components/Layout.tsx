import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const nav = [
  { name: 'Agents', href: '/agents' },
  { name: 'Ailments', href: '/ailments' },
  { name: 'Therapies', href: '/therapies' },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-semibold">AgentClinic</Link>
            <nav className="flex space-x-4">
              {nav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith(item.href) ? 'bg-primary-700' : 'hover:bg-primary-500'}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t py-4">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500 text-center">
          &copy; {new Date().getFullYear()} AgentClinic
        </div>
      </footer>
    </div>
  )
}
