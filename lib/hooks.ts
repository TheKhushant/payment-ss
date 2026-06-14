'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from './api-client'
import { CreateStudentRequest, UpdateStudentRequest, CreatePaymentRequest, CreatePaymentApprovalRequest } from './types'

// Dashboard queries
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => apiService.getDashboardMetrics(),
  })
}

export function usePaymentStats(days: number = 30) {
  return useQuery({
    queryKey: ['dashboard', 'payment-stats', days],
    queryFn: () => apiService.getPaymentStats(days),
  })
}

export function useRevenueChartData(days: number = 30) {
  return useQuery({
    queryKey: ['dashboard', 'revenue-chart', days],
    queryFn: () => apiService.getRevenueChartData(days),
  })
}

// Student queries
export function useStudents(page: number = 1, limit: number = 10, search: string = '') {
  return useQuery({
    queryKey: ['students', page, limit, search],
    queryFn: () => apiService.getStudents(page, limit, search),
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => apiService.getStudent(id),
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateStudentRequest) => apiService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      apiService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

// Payment queries
export function usePayments(page: number = 1, limit: number = 10, studentId?: string) {
  return useQuery({
    queryKey: ['payments', page, limit, studentId],
    queryFn: () => apiService.getPayments(page, limit, studentId),
  })
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => apiService.getPayment(id),
    enabled: !!id,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => apiService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useApprovePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiService.approvePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRejectPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiService.rejectPayment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Payment request queries
export function usePaymentRequests(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['payment-requests', page, limit],
    queryFn: () => apiService.getPaymentRequests(page, limit),
  })
}

export function useCreatePaymentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentApprovalRequest) => apiService.createPaymentRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useApprovePaymentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiService.approvePaymentRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRejectPaymentRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiService.rejectPaymentRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Course queries
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => apiService.getCourses(),
  })
}

// Auth hooks
export function useAuth() {
  if (typeof window === 'undefined') return null
  
  const user = localStorage.getItem('auth_user')
  const token = localStorage.getItem('auth_token')
  
  return user && token ? JSON.parse(user) : null
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.login,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      queryClient.setQueryData(['auth', 'user'], data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.logout,
    onSuccess: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      queryClient.clear()
    },
  })
}
