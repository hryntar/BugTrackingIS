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
}
