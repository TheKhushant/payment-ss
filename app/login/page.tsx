'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  const router = useRouter()
  const user = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Student Fee Management
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to manage student fees
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Demo Credentials:
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Username: <span className="font-mono">admin</span>
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Password: <span className="font-mono">password123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
