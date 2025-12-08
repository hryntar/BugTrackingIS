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

export type IssueStatus = 'NEW' | 'IN_PROGRESS' | 'READY_FOR_QA' | 'REOPENED' | 'CLOSED'

export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type IssueSeverity = 'TRIVIAL' | 'MINOR' | 'MAJOR' | 'CRITICAL'

export interface IssueUser {
   id: number
   name: string
}

export interface Issue {
   id: number
   key: string
   title: string
   description: string
   status: IssueStatus
   priority: IssuePriority
   severity: IssueSeverity
   environment: string | null
   reporter: IssueUser
   assignee: IssueUser | null
   createdAt: string
   updatedAt: string
}

export interface IssueListResponse {
   items: Issue[]
   page: number
   pageSize: number
   total: number
}

export interface IssueListFilters {
   status?: IssueStatus
   assigneeId?: number
   reporterId?: number
   search?: string
   page?: number
   pageSize?: number
}

export type IssueListView = 'all' | 'my' | 'reported' | 'watching'

export interface CreateIssueRequest {
   title: string
   description: string
   priority: IssuePriority
   severity: IssueSeverity
   environment?: string | null
   subscribeToUpdates?: boolean
}
