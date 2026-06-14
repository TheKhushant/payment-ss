'use client'

import { useState } from 'react'
import { Payment } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useApprovePayment, useRejectPayment } from '@/lib/hooks'

interface PaymentsTableProps {
  payments: Payment[]
  onRefresh: () => void
}

export function PaymentsTable({ payments, onRefresh }: PaymentsTableProps) {
  const approvePayment = useApprovePayment()
  const rejectPayment = useRejectPayment()
  const [actionPaymentId, setActionPaymentId] = useState<string>('')
  const [rejectReason, setRejectReason] = useState<string>('')
  const [rejectingId, setRejectingId] = useState<string>('')

  const handleApprove = async (id: string) => {
    try {
      setActionPaymentId(id)
      await approvePayment.mutateAsync(id)
      onRefresh()
    } catch (error) {
      console.error('Failed to approve payment:', error)
    } finally {
      setActionPaymentId('')
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    try {
      setRejectingId(id)
      await rejectPayment.mutateAsync({ id, reason: rejectReason })
      setRejectReason('')
      onRefresh()
    } catch (error) {
      console.error('Failed to reject payment:', error)
    } finally {
      setRejectingId('')
    }
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <p className="text-muted-foreground">No payments found.</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left font-semibold text-foreground">Student ID</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Method</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Due Date</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Paid Date</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{payment.studentId}</td>
                <td className="px-6 py-4 font-bold text-foreground">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 text-muted-foreground capitalize">{payment.method}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : payment.status === 'paid'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{formatDate(payment.dueDate)}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {payment.paidDate ? formatDate(payment.paidDate) : '-'}
                </td>
                <td className="px-6 py-4">
                  {payment.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(payment.id)}
                        disabled={actionPaymentId === payment.id}
                      >
                        {actionPaymentId === payment.id ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:')
                          if (reason) {
                            setRejectReason(reason)
                            handleReject(payment.id)
                          }
                        }}
                        disabled={rejectingId === payment.id}
                      >
                        {rejectingId === payment.id ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>
                  )}
                  {payment.status !== 'pending' && (
                    <span className="text-xs text-muted-foreground">
                      {payment.status === 'approved' ? 'Approved' : 'Completed'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
