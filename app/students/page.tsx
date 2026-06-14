'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StudentsTable } from '@/components/students/students-table'
import { StudentForm } from '@/components/students/student-form'
import { useStudents, useCourses } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function StudentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { data: studentsData, isLoading, refetch } = useStudents(page, 10, search)
  const { data: courses = [] } = useCourses()

  const students = studentsData?.data || []
  const total = studentsData?.total || 0
  const totalPages = Math.ceil(total / 10)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Manage student records and enrollments</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Student'}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Add New Student</h2>
            <StudentForm
              courses={courses}
              onSuccess={() => {
                setShowForm(false)
                refetch()
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="bg-card rounded-lg border border-border h-96 animate-pulse" />
          ) : (
            <>
              <StudentsTable students={students} onRefresh={() => refetch()} />

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
