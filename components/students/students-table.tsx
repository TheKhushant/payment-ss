'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Student } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDeleteStudent } from '@/lib/hooks'

interface StudentsTableProps {
  students: Student[]
  onRefresh: () => void
}

export function StudentsTable({ students, onRefresh }: StudentsTableProps) {
  const deleteStudent = useDeleteStudent()
  const [deletingId, setDeletingId] = useState<string>('')

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        setDeletingId(id)
        await deleteStudent.mutateAsync(id)
        onRefresh()
      } catch (error) {
        console.error('Failed to delete student:', error)
      } finally {
        setDeletingId('')
      }
    }
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <p className="text-muted-foreground">No students found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Phone</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Total Fees</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Paid</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Pending</th>
              <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{student.email}</td>
                <td className="px-6 py-4 text-muted-foreground">{student.phone}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    student.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : student.status === 'inactive'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {formatCurrency(student.totalFees)}
                </td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  {formatCurrency(student.paidAmount)}
                </td>
                <td className="px-6 py-4 text-orange-600 font-medium">
                  {formatCurrency(student.pendingAmount)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(student.id)}
                      disabled={deletingId === student.id}
                    >
                      {deletingId === student.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
