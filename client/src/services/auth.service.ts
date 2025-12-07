import { apiClient } from '@/lib/api-client'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/lib/types'

export const authService = {
   async login(data: LoginRequest): Promise<AuthResponse> {
      const response = await apiClient.post<AuthResponse>('/auth/login', data)
      return response.data
   },

   async register(data: RegisterRequest): Promise<AuthResponse> {
      const response = await apiClient.post<AuthResponse>('/auth/register', data)
      return response.data
   },

   async getCurrentUser(): Promise<User> {
      const response = await apiClient.get<User>('/auth/me')
      return response.data
   },

   setToken(token: string): void {
      localStorage.setItem('auth_token', token)
   },

   getToken(): string | null {
      return localStorage.getItem('auth_token')
   },

   removeToken(): void {
      localStorage.removeItem('auth_token')
   },
}
