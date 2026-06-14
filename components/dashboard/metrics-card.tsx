'use client'

interface MetricsCardProps {
  label: string
  value: string | number
  icon: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
  change?: {
    value: number
    type: 'up' | 'down'
  }
}

export function MetricsCard({
  label,
  value,
  icon,
  color = 'primary',
  change,
}: MetricsCardProps) {
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change.type === 'up' ? '↑' : '↓'} {change.value}% from last month
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
