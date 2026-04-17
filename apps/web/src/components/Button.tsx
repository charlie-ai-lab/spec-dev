import type { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50'
  const styles = {
    primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 focus:ring-primary-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
