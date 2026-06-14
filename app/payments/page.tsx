'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PaymentsTable } from '@/components/payments/payments-table'
import { PaymentForm } from '@/components/payments/payment-form'
import { usePayments, useStudents } from '@/lib/hooks'
import { Button } from '@/components/ui/button'

export default function PaymentsPage() {
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const { data: paymentsData, isLoading, refetch } = usePayments(page, 10)
  const { data: studentsData } = useStudents(1, 100)

  const payments = paymentsData?.data || []
  const students = studentsData?.data || []
  const total = paymentsData?.total || 0
  const totalPages = Math.ceil(total / 10)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground mt-1">Track and manage student payments</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Record Payment'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Record New Payment</h2>
            <PaymentForm
              students={students}
              onSuccess={() => {
                setShowForm(false)
                refetch()
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-card rounded-lg border border-border h-96 animate-pulse" />
          ) : (
            <>
              <PaymentsTable payments={payments} onRefresh={() => refetch()} />

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        onClick={() => setPage(p)}
                        size="sm"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
