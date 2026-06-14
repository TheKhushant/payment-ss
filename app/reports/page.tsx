'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useStudents, usePayments } from '@/lib/hooks'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'students' | 'payments' | 'revenue'>('students')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data: studentsData } = useStudents(1, 1000)
  const { data: paymentsData } = usePayments(1, 1000)

  const students = studentsData?.data || []
  const payments = paymentsData?.data || []

  const exportToCSV = (filename: string, data: any[]) => {
    if (data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`
            }
            return value
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const getStudentReport = () => {
    const reportData = students.map((s: any) => ({
      'Student ID': s.id,
      'First Name': s.firstName,
      'Last Name': s.lastName,
      Email: s.email,
      Phone: s.phone,
      Status: s.status,
      'Total Fees': s.totalFees,
      'Paid Amount': s.paidAmount,
      'Pending Amount': s.pendingAmount,
      'Enrollment Date': formatDate(s.enrollmentDate),
    }))
    exportToCSV('student-report', reportData)
  }

  const getPaymentReport = () => {
    const reportData = payments.map((p: any) => ({
      'Payment ID': p.id,
      'Student ID': p.studentId,
      Amount: p.amount,
      Method: p.method,
      Status: p.status,
      'Due Date': formatDate(p.dueDate),
      'Paid Date': p.paidDate ? formatDate(p.paidDate) : '',
      Notes: p.notes,
      'Created Date': formatDate(p.createdAt),
    }))
    exportToCSV('payment-report', reportData)
  }

  const getRevenueReport = () => {
    const groupedPayments: any = {}
    payments.forEach((p: any) => {
      const date = formatDate(p.createdAt)
      if (!groupedPayments[date]) {
        groupedPayments[date] = {
          Date: date,
          'Total Revenue': 0,
          'Payment Count': 0,
          'Approved Payments': 0,
          'Paid Payments': 0,
        }
      }
      groupedPayments[date]['Total Revenue'] += p.amount
      groupedPayments[date]['Payment Count'] += 1
      if (p.status === 'approved') groupedPayments[date]['Approved Payments'] += 1
      if (p.status === 'paid') groupedPayments[date]['Paid Payments'] += 1
    })

    const reportData = Object.values(groupedPayments)
    exportToCSV('revenue-report', reportData)
  }

  const summaryMetrics = {
    totalStudents: students.length,
    activeStudents: students.filter((s: any) => s.status === 'active').length,
    totalRevenue: students.reduce((sum: number, s: any) => sum + s.paidAmount, 0),
    pendingAmount: students.reduce((sum: number, s: any) => sum + s.pendingAmount, 0),
    totalPayments: payments.length,
    approvedPayments: payments.filter((p: any) => p.status === 'approved').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and export business reports</p>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground font-medium">Total Students</p>
            <p className="text-2xl font-bold text-foreground mt-2">{summaryMetrics.totalStudents}</p>
            <p className="text-xs text-green-600 mt-1">{summaryMetrics.activeStudents} active</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {formatCurrency(summaryMetrics.totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Paid to date</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground font-medium">Pending Amount</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {formatCurrency(summaryMetrics.pendingAmount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground font-medium">Total Payments</p>
            <p className="text-2xl font-bold text-foreground mt-2">{summaryMetrics.totalPayments}</p>
            <p className="text-xs text-green-600 mt-1">{summaryMetrics.approvedPayments} approved</p>
          </div>
        </div>

        {/* Report Types */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Generate Reports</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Report */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Student Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export all student records with enrollment details and payment status
              </p>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Total records: <span className="font-bold text-foreground">{students.length}</span>
                </div>
                <Button className="w-full" onClick={getStudentReport}>
                  Export as CSV
                </Button>
              </div>
            </div>

            {/* Payment Report */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Payment Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export payment records with status, amounts, and transaction details
              </p>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Total records: <span className="font-bold text-foreground">{payments.length}</span>
                </div>
                <Button className="w-full" onClick={getPaymentReport}>
                  Export as CSV
                </Button>
              </div>
            </div>

            {/* Revenue Report */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Revenue Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export daily revenue summary with payment counts and statuses
              </p>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Total revenue: <span className="font-bold text-foreground">{formatCurrency(summaryMetrics.totalRevenue)}</span>
                </div>
                <Button className="w-full" onClick={getRevenueReport}>
                  Export as CSV
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> All reports are exported as CSV files. You can open them in Excel or any spreadsheet application for further analysis.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
