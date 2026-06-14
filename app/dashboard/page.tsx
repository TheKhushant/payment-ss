'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { useDashboardMetrics, useRevenueChartData } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { data: chartData = [], isLoading: chartLoading } = useRevenueChartData(30)

  if (metricsLoading || chartLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s your overview.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsCard
            label="Total Students"
            value={metrics?.totalStudents || 0}
            icon="👥"
            color="primary"
          />
          <MetricsCard
            label="Total Revenue"
            value={formatCurrency(metrics?.totalRevenue || 0)}
            icon="💰"
            color="success"
          />
          <MetricsCard
            label="Pending Payments"
            value={metrics?.pendingPayments || 0}
            icon="⏳"
            color="warning"
          />
          <MetricsCard
            label="Payment Requests"
            value={metrics?.approvalRequests || 0}
            icon="📝"
            color="primary"
          />
          <MetricsCard
            label="Active Students"
            value={metrics?.activeStudents || 0}
            icon="✓"
            color="success"
          />
          <MetricsCard
            label="Completion Rate"
            value={`${metrics?.completionRate || 0}%`}
            icon="📊"
            color="success"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={chartData} />
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/students"
                className="block p-4 bg-blue-50 hover:bg-blue-100 text-primary rounded-lg transition-colors font-medium"
              >
                Manage Students
              </a>
              <a
                href="/payments"
                className="block p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors font-medium"
              >
                Track Payments
              </a>
              <a
                href="/payment-requests"
                className="block p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors font-medium"
              >
                Approve Requests
              </a>
              <a
                href="/reports"
                className="block p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium"
              >
                Generate Reports
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
