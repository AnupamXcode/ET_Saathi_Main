'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClass = {
    default: 'bg-gold/20 text-gold',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }[variant]

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variantClass} ${className}`}>
      {children}
    </span>
  )
}
