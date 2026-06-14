'use client'

import { useRouter } from 'next/navigation'
import { useAuth, useLogout } from '@/lib/hooks'
import { Button } from '@/components/ui/button'

export function Header() {
  const router = useRouter()
  const user = useAuth()
  const logoutMutation = useLogout()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">Student Fee Management</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
