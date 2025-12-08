import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, UserPlus, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignIssueDialog } from "@/components/assign-issue-dialog";
import { ChangeStatusDialog } from "@/components/change-status-dialog";
import { issueService } from "@/services/issue.service";
import type { Issue, User, IssueStatus } from "@/lib/types";

interface IssueWorkflowActionsProps {
  issue: Issue;
  currentUser: User;
  users: User[];
  isWatching: boolean;
}

export function IssueWorkflowActions({ issue, currentUser, users, isWatching }: IssueWorkflowActionsProps) {
  const queryClient = useQueryClient();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const canTakeIssue = currentUser.role === "DEV" && issue.status === "NEW" && !issue.assignee;
  const canChangeStatus =
    (currentUser.role === "DEV" && issue.assignee?.id === currentUser.id) || currentUser.role === "QA" || currentUser.role === "PM";
  const canAssign = currentUser.role === "QA" || currentUser.role === "PM";

  const takeMutation = useMutation({
    mutationFn: () => issueService.takeIssue(issue.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id.toString()] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (assigneeId: number) => issueService.assignIssue(issue.id, assigneeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id.toString()] });
      setAssignDialogOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: IssueStatus) => issueService.changeStatus(issue.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id.toString()] });
      setStatusDialogOpen(false);
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: () => issueService.subscribeToIssue(issue.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id.toString()] });
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {canTakeIssue && (
          <Button onClick={() => takeMutation.mutate()} disabled={takeMutation.isPending} size="sm">
            {takeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <GitBranch className="mr-2 h-4 w-4" />
            Take in Work
          </Button>
        )}

        {canAssign && (
          <Button onClick={() => setAssignDialogOpen(true)} variant="outline" size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Assign
          </Button>
        )}

        {canChangeStatus && (
          <Button onClick={() => setStatusDialogOpen(true)} variant="outline" size="sm">
            Change Status
          </Button>
        )}

        {!isWatching && (
          <Button onClick={() => subscribeMutation.mutate()} disabled={subscribeMutation.isPending} variant="outline" size="sm">
            {subscribeMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bell className="mr-2 h-4 w-4" />}
            Watch
          </Button>
        )}
        {isWatching && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-md">
            <Bell className="h-4 w-4" />
            Watching
          </div>
        )}
      </div>

      <AssignIssueDialog
        issue={issue}
        users={users.filter((u) => u.role === "DEV")}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssign={(issueId, assigneeId) => assignMutation.mutate(assigneeId)}
        isLoading={assignMutation.isPending}
      />

      <ChangeStatusDialog
        issue={issue}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onChangeStatus={(issueId, status) => statusMutation.mutate(status)}
        isLoading={statusMutation.isPending}
      />
    </>
  );
}
