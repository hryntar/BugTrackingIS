export type UserRole = 'QA' | 'DEV' | 'PM' | 'CLIENT'

export interface User {
   id: number
   name: string
   email: string
   role: UserRole
   active: boolean
}

export interface AuthResponse {
   user: User
   token: string
}

export interface LoginRequest {
   email: string
   password: string
}

export interface RegisterRequest {
   name: string
   email: string
   password: string
   role: UserRole
}

export interface ApiError {
   error: {
      code: string
      message: string
      details?: unknown
   }
}
