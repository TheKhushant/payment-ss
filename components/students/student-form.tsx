'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Course } from '@/lib/types'
import { useCreateStudent, useUpdateStudent } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  courseId: z.string().min(1, 'Course is required'),
  totalFees: z.coerce.number().min(0, 'Total fees must be positive'),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormProps {
  courses: Course[]
  student?: any
  onSuccess: () => void
  onCancel: () => void
}

export function StudentForm({ courses, student, onSuccess, onCancel }: StudentFormProps) {
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student ? {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      courseId: student.courseId,
      totalFees: student.totalFees,
    } : undefined,
  })

  const onSubmit = async (data: StudentFormData) => {
    try {
      setError('')
      if (student) {
        await updateStudent.mutateAsync({
          id: student.id,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            totalFees: data.totalFees,
          },
        })
      } else {
        await createStudent.mutateAsync(data)
      }
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save student')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            {...register('firstName')}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            {...register('lastName')}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          {...register('phone')}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      {!student && (
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-foreground mb-1">
            Course
          </label>
          <select
            id="courseId"
            {...register('courseId')}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} - ${course.price}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-sm text-destructive mt-1">{errors.courseId.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="totalFees" className="block text-sm font-medium text-foreground mb-1">
          Total Fees
        </label>
        <Input
          id="totalFees"
          type="number"
          placeholder="0.00"
          step="0.01"
          {...register('totalFees')}
          disabled={isSubmitting}
        />
        {errors.totalFees && (
          <p className="text-sm text-destructive mt-1">{errors.totalFees.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || createStudent.isPending || updateStudent.isPending}
          className="flex-1"
        >
          {isSubmitting || createStudent.isPending || updateStudent.isPending
            ? 'Saving...'
            : student
            ? 'Update Student'
            : 'Add Student'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
