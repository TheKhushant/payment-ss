'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface RevenueChartProps {
  data: Array<{
    date: string
    amount: number
    count: number
  }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground mb-6">Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--color-muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--color-muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--color-card))',
              border: '1px solid hsl(var(--color-border))',
              borderRadius: '0.5rem',
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--color-primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--color-primary))', r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--color-muted-foreground))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--color-muted-foreground))', r: 4 }}
            activeDot={{ r: 6 }}
            name="Payments"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
