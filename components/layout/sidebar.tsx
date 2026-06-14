'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Students',
    href: '/students',
    icon: '👥',
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: '💳',
  },
  {
    label: 'Payment Requests',
    href: '/payment-requests',
    icon: '📝',
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: '📚',
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: '📈',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sidebar-primary">SFM</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Student Fee Manager</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border pt-4">
        <p className="text-xs text-sidebar-foreground/60 text-center">v1.0.0</p>
      </div>
    </aside>
  )
}
