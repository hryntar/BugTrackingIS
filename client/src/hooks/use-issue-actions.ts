import { useMutation, useQueryClient } from '@tanstack/react-query'
import { issueService } from '@/services/issue.service'
import type { IssueStatus } from '@/lib/types'

export function useIssueActions() {
   const queryClient = useQueryClient()

   const takeIssue = useMutation({
      mutationFn: (id: number) => issueService.takeIssue(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['issues'] })
      },
   })

   const assignIssue = useMutation({
      mutationFn: ({ id, assigneeId }: { id: number; assigneeId: number }) =>
         issueService.assignIssue(id, assigneeId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['issues'] })
      },
   })

   const changeStatus = useMutation({
      mutationFn: ({ id, status }: { id: number; status: IssueStatus }) =>
         issueService.changeStatus(id, status),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['issues'] })
      },
   })

   const subscribeToIssue = useMutation({
      mutationFn: (id: number) => issueService.subscribeToIssue(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['issues'] })
      },
   })

   return {
      takeIssue,
      assignIssue,
      changeStatus,
      subscribeToIssue,
   }
}
