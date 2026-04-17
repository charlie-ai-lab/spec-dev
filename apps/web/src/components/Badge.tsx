const colorMap: Record<string, string> = {
  healthy: 'bg-green-100 text-green-800',
  degraded: 'bg-yellow-100 text-yellow-800',
  offline: 'bg-red-100 text-red-800',
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
  open: 'bg-orange-100 text-orange-800',
  closed: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  failure: 'bg-red-100 text-red-800',
  in_progress: 'bg-blue-100 text-blue-800',
}

export function Badge({ children }: { children: string }) {
  const cls = colorMap[children] || 'bg-slate-100 text-slate-800'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {children.replace('_', ' ')}
    </span>
  )
}
