import { apiClient } from '@/lib/api-client'
import type {
   Issue,
   IssueListResponse,
   IssueListFilters,
   IssueStatus,
} from '@/lib/types'

export const issueService = {
   async getIssues(filters: IssueListFilters): Promise<IssueListResponse> {
      const response = await apiClient.get<IssueListResponse>('/issues', {
         params: filters,
      })
      return response.data
   },

   async getIssueById(id: number): Promise<Issue> {
      const response = await apiClient.get<Issue>(`/issues/${id}`)
      return response.data
   },

   async takeIssue(id: number): Promise<Issue> {
      const response = await apiClient.post<Issue>(`/issues/${id}/take`)
      return response.data
   },

   async assignIssue(id: number, assigneeId: number): Promise<Issue> {
      const response = await apiClient.post<Issue>(`/issues/${id}/assign`, {
         assigneeId,
      })
      return response.data
   },

   async changeStatus(id: number, status: IssueStatus): Promise<Issue> {
      const response = await apiClient.post<Issue>(`/issues/${id}/status`, {
         status,
      })
      return response.data
   },

   async subscribeToIssue(id: number): Promise<void> {
      await apiClient.post(`/issues/${id}/subscribe`)
   },

   async createIssue(data: import('@/lib/types').CreateIssueRequest): Promise<Issue> {
      const response = await apiClient.post<Issue>('/issues', data)
      return response.data
   },

   async getComments(issueId: number): Promise<import('@/lib/types').Comment[]> {
      const response = await apiClient.get<import('@/lib/types').Comment[]>(`/issues/${issueId}/comments`)
      return response.data
   },

   async createComment(issueId: number, data: import('@/lib/types').CreateCommentRequest): Promise<import('@/lib/types').Comment> {
      const response = await apiClient.post<import('@/lib/types').Comment>(`/issues/${issueId}/comments`, data)
      return response.data
   },

   async updateComment(commentId: number, data: import('@/lib/types').UpdateCommentRequest): Promise<import('@/lib/types').Comment> {
      const response = await apiClient.patch<import('@/lib/types').Comment>(`/comments/${commentId}`, data)
      return response.data
   },

   async getCodeChanges(issueId: number): Promise<import('@/lib/types').CodeChange[]> {
      const response = await apiClient.get<import('@/lib/types').CodeChange[]>(`/issues/${issueId}/code-changes`)
      return response.data
   },
}
