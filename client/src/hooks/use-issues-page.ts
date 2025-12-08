import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";
import { useIssues } from "./use-issues";
import { useIssueActions } from "./use-issue-actions";
import { userService } from "@/services/user.service";
import type { Issue, IssueListFilters, IssueListView, IssueStatus } from "@/lib/types";

export function useIssuesPage() {
  const { user } = useAuth();
  const [view, setView] = useState<IssueListView>("all");
  const [filters, setFilters] = useState<IssueListFilters>({
    page: 1,
    pageSize: 20,
  });
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // Fetch users for assignment
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  // Get view-specific filters
  const viewFilters = getViewFilters(view, user?.id, filters);

  // Fetch issues with filters
  const { data: issuesData, isLoading: issuesLoading } = useIssues(viewFilters);

  // Issue actions
  const { takeIssue, assignIssue, changeStatus } = useIssueActions();

  // Permission checks
  const canCreateIssue = user?.role === "QA" || user?.role === "PM";

  // Handlers
  const handleTakeIssue = useCallback((id: number) => {
    takeIssue.mutate(id);
  }, [takeIssue]);

  const handleAssignIssue = useCallback(
    (issueId: number, assigneeId: number) => {
      assignIssue.mutate(
        { id: issueId, assigneeId },
        {
          onSuccess: () => {
            setAssignDialogOpen(false);
            setSelectedIssue(null);
          },
        }
      );
    },
    [assignIssue]
  );

  const handleChangeStatus = useCallback(
    (issueId: number, status: IssueStatus) => {
      changeStatus.mutate(
        { id: issueId, status },
        {
          onSuccess: () => {
            setStatusDialogOpen(false);
            setSelectedIssue(null);
          },
        }
      );
    },
    [changeStatus]
  );

  const handleOpenAssignDialog = useCallback((issue: Issue) => {
    setSelectedIssue(issue);
    setAssignDialogOpen(true);
  }, []);

  const handleOpenStatusDialog = useCallback((issue: Issue) => {
    setSelectedIssue(issue);
    setStatusDialogOpen(true);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((f) => ({ ...f, page: newPage }));
  }, []);

  return {
    // State
    view,
    filters,
    selectedIssue,
    assignDialogOpen,
    statusDialogOpen,

    // Data
    user,
    users: usersData || [],
    issues: issuesData?.items || [],
    issuesTotal: issuesData?.total || 0,

    // Loading states
    usersLoading,
    issuesLoading,
    isAssigning: assignIssue.isPending,
    isChangingStatus: changeStatus.isPending,

    // Permissions
    canCreateIssue,

    // Setters
    setView,
    setFilters,
    setAssignDialogOpen,
    setStatusDialogOpen,

    // Handlers
    handleTakeIssue,
    handleAssignIssue,
    handleChangeStatus,
    handleOpenAssignDialog,
    handleOpenStatusDialog,
    handlePageChange,
  };
}

function getViewFilters(
  view: IssueListView,
  userId: number | undefined,
  baseFilters: IssueListFilters
): IssueListFilters {
  switch (view) {
    case "my":
      return { ...baseFilters, assigneeId: userId };
    case "reported":
      return { ...baseFilters, reporterId: userId };
    case "watching":
      return { ...baseFilters };
    default:
      return baseFilters;
  }
}
