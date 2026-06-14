export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  createdAt: string
}

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'graduated'
  totalFees: number
  paidAmount: number
  pendingAmount: number
  courseId: string
}

export interface Course {
  id: string
  name: string
  code: string
  duration: number // in months
  price: number
  description: string
  createdAt: string
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  method: 'cash' | 'check' | 'transfer' | 'card'
  dueDate: string
  paidDate: string | null
  notes: string
  createdAt: string
}

export interface PaymentRequest {
  id: string
  studentId: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedDate: string
  resolvedDate: string | null
  notes: string
}

export interface DashboardMetrics {
  totalStudents: number
  totalRevenue: number
  pendingPayments: number
  approvalRequests: number
  activeStudents: number
  completionRate: number
}

export interface PaymentStats {
  date: string
  amount: number
  count: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  username: string
  password: string
}

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  courseId: string
  totalFees: number
}

export interface UpdateStudentRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  status?: string
  totalFees?: number
}

export interface CreatePaymentRequest {
  studentId: string
  amount: number
  method: string
  dueDate: string
  notes?: string
}

export interface CreatePaymentApprovalRequest {
  studentId: string
  amount: number
  reason: string
  notes?: string
}
