'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { usePaymentRequests, useApprovePaymentRequest, useRejectPaymentRequest } from '@/lib/hooks'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function PaymentRequestsPage() {
  const [page, setPage] = useState(1)
  const { data: requestsData, isLoading, refetch } = usePaymentRequests(page, 10)
  const approveRequest = useApprovePaymentRequest()
  const rejectRequest = useRejectPaymentRequest()
  const [actionId, setActionId] = useState<string>('')

  const requests = requestsData?.data || []
  const total = requestsData?.total || 0
  const totalPages = Math.ceil(total / 10)

  const handleApprove = async (id: string) => {
    try {
      setActionId(id)
      await approveRequest.mutateAsync(id)
      refetch()
    } catch (error) {
      console.error('Failed to approve request:', error)
    } finally {
      setActionId('')
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:')
    if (reason) {
      try {
        setActionId(id)
        await rejectRequest.mutateAsync({ id, reason })
        refetch()
      } catch (error) {
        console.error('Failed to reject request:', error)
      } finally {
        setActionId('')
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Requests</h1>
          <p className="text-muted-foreground mt-1">Review and approve payment requests</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-card rounded-lg border border-border h-96 animate-pulse" />
          ) : requests.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">No payment requests at this time.</p>
            </div>
          ) : (
            <>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Student ID</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Amount</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Reason</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Requested</th>
                        <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request: any) => (
                        <tr key={request.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{request.studentId}</td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {formatCurrency(request.amount)}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{request.reason}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {formatDate(request.requestedDate)}
                          </td>
                          <td className="px-6 py-4">
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700"
                                  onClick={() => handleApprove(request.id)}
                                  disabled={actionId === request.id}
                                >
                                  {actionId === request.id ? 'Processing...' : 'Approve'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleReject(request.id)}
                                  disabled={actionId === request.id}
                                >
                                  {actionId === request.id ? 'Processing...' : 'Reject'}
                                </Button>
                              </div>
                            )}
                            {request.status !== 'pending' && (
                              <span className="text-xs text-muted-foreground">
                                {request.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
