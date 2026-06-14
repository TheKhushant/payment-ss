import axios, { AxiosInstance } from 'axios'
import { AuthResponse, LoginRequest, CreateStudentRequest, UpdateStudentRequest, CreatePaymentRequest, CreatePaymentApprovalRequest } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

let apiClient: AxiosInstance

function getApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    apiClient.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    })

    // Add response interceptor for error handling
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  return apiClient
}

export const apiService = {
  // Auth endpoints
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await getApiClient().post('/auth/login', credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await getApiClient().post('/auth/logout')
  },

  // Dashboard endpoints
  getDashboardMetrics: async () => {
    const response = await getApiClient().get('/dashboard/metrics')
    return response.data
  },

  getPaymentStats: async (days: number = 30) => {
    const response = await getApiClient().get('/dashboard/payment-stats', { params: { days } })
    return response.data
  },

  getRevenueChartData: async (days: number = 30) => {
    const response = await getApiClient().get('/dashboard/revenue-chart', { params: { days } })
    return response.data
  },

  // Student endpoints
  getStudents: async (page: number = 1, limit: number = 10, search: string = '') => {
    const response = await getApiClient().get('/students', { params: { page, limit, search } })
    return response.data
  },

  getStudent: async (id: string) => {
    const response = await getApiClient().get(`/students/${id}`)
    return response.data
  },

  createStudent: async (data: CreateStudentRequest) => {
    const response = await getApiClient().post('/students', data)
    return response.data
  },

  updateStudent: async (id: string, data: UpdateStudentRequest) => {
    const response = await getApiClient().put(`/students/${id}`, data)
    return response.data
  },

  deleteStudent: async (id: string) => {
    await getApiClient().delete(`/students/${id}`)
  },

  // Payment endpoints
  getPayments: async (page: number = 1, limit: number = 10, studentId?: string) => {
    const response = await getApiClient().get('/payments', { params: { page, limit, studentId } })
    return response.data
  },

  getPayment: async (id: string) => {
    const response = await getApiClient().get(`/payments/${id}`)
    return response.data
  },

  createPayment: async (data: CreatePaymentRequest) => {
    const response = await getApiClient().post('/payments', data)
    return response.data
  },

  approvePayment: async (id: string) => {
    const response = await getApiClient().patch(`/payments/${id}/approve`)
    return response.data
  },

  rejectPayment: async (id: string, reason: string) => {
    const response = await getApiClient().patch(`/payments/${id}/reject`, { reason })
    return response.data
  },

  // Payment approval requests
  getPaymentRequests: async (page: number = 1, limit: number = 10) => {
    const response = await getApiClient().get('/payment-requests', { params: { page, limit } })
    return response.data
  },

  createPaymentRequest: async (data: CreatePaymentApprovalRequest) => {
    const response = await getApiClient().post('/payment-requests', data)
    return response.data
  },

  approvePaymentRequest: async (id: string) => {
    const response = await getApiClient().patch(`/payment-requests/${id}/approve`)
    return response.data
  },

  rejectPaymentRequest: async (id: string, reason: string) => {
    const response = await getApiClient().patch(`/payment-requests/${id}/reject`, { reason })
    return response.data
  },

  // Course endpoints
  getCourses: async () => {
    const response = await getApiClient().get('/courses')
    return response.data
  },

  createCourse: async (data: any) => {
    const response = await getApiClient().post('/courses', data)
    return response.data
  },

  updateCourse: async (id: string, data: any) => {
    const response = await getApiClient().put(`/courses/${id}`, data)
    return response.data
  },

  deleteCourse: async (id: string) => {
    await getApiClient().delete(`/courses/${id}`)
  },

  // Reports endpoints
  generateStudentReport: async (filters: any) => {
    const response = await getApiClient().get('/reports/students', { params: filters })
    return response.data
  },

  generatePaymentReport: async (filters: any) => {
    const response = await getApiClient().get('/reports/payments', { params: filters })
    return response.data
  },

  generateRevenueReport: async (filters: any) => {
    const response = await getApiClient().get('/reports/revenue', { params: filters })
    return response.data
  },
}
