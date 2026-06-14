'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Student } from '@/lib/types'
import { useCreatePayment } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  method: z.enum(['cash', 'check', 'transfer', 'card']),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  students: Student[]
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ students, onSuccess, onCancel }: PaymentFormProps) {
  const createPayment = useCreatePayment()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setError('')
      await createPayment.mutateAsync(data)
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create payment')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-foreground mb-1">
          Student
        </label>
        <select
          id="studentId"
          {...register('studentId')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName} - Pending: ${student.pendingAmount.toFixed(2)}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="text-sm text-destructive mt-1">{errors.studentId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            {...register('amount')}
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="method" className="block text-sm font-medium text-foreground mb-1">
            Payment Method
          </label>
          <select
            id="method"
            {...register('method')}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="transfer">Bank Transfer</option>
            <option value="card">Card</option>
          </select>
          {errors.method && (
            <p className="text-sm text-destructive mt-1">{errors.method.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-1">
          Due Date
        </label>
        <Input
          id="dueDate"
          type="date"
          {...register('dueDate')}
          disabled={isSubmitting}
        />
        {errors.dueDate && (
          <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          placeholder="Add any notes about this payment..."
          {...register('notes')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          rows={3}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || createPayment.isPending}
          className="flex-1"
        >
          {isSubmitting || createPayment.isPending ? 'Creating...' : 'Create Payment'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
