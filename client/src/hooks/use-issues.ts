import { useQuery } from '@tanstack/react-query'
import { issueService } from '@/services/issue.service'
import type { IssueListFilters } from '@/lib/types'

export function useIssues(filters: IssueListFilters) {
   return useQuery({
      queryKey: ['issues', filters],
      queryFn: () => issueService.getIssues(filters),
   })
}
