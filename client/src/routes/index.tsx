import { createFileRoute, redirect } from "@tanstack/react-router";
import { useIssuesPage } from "@/hooks/use-issues-page";
import { AppShell } from "@/components/layout";
import { IssuesFilter } from "@/components/issues-filter";
import { IssuesTable } from "@/components/issues-table";
import { AssignIssueDialog } from "@/components/assign-issue-dialog";
import { ChangeStatusDialog } from "@/components/change-status-dialog";
import { IssuesViewTabs, IssuesPagination, IssuesLoading, IssuesEmptyState } from "@/components/issues";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: IssuesPage,
});

function IssuesPage() {
  const {
    view,
    filters,
    selectedIssue,
    assignDialogOpen,
    statusDialogOpen,
    user,
    users,
    issues,
    issuesTotal,
    usersLoading,
    issuesLoading,
    isAssigning,
    isChangingStatus,
    canCreateIssue,
    setView,
    setFilters,
    setAssignDialogOpen,
    setStatusDialogOpen,
    handleTakeIssue,
    handleAssignIssue,
    handleChangeStatus,
    handleOpenAssignDialog,
    handleOpenStatusDialog,
    handlePageChange,
  } = useIssuesPage();

  return (
    <AppShell>
      <div className="container max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
              <p className="text-muted-foreground">Track and manage bugs across your projects</p>
            </div>
            {canCreateIssue && (
              <Button className="gap-2 self-start sm:self-auto">
                <Plus className="h-4 w-4" />
                Create Issue
              </Button>
            )}
          </div>

          {/* View Tabs */}
          <IssuesViewTabs view={view} onViewChange={setView} />

          {/* Filters */}
          <Card className="p-6">
            {usersLoading ? (
              <IssuesLoading message="Loading filters..." />
            ) : (
              <IssuesFilter filters={filters} onFiltersChange={setFilters} users={users} />
            )}
          </Card>

          {/* Issues List */}
          <Card className="p-6">
            {issuesLoading ? (
              <IssuesLoading />
            ) : issues.length === 0 ? (
              <IssuesEmptyState view={view} />
            ) : (
              <div className="space-y-6">
                <IssuesTable
                  issues={issues}
                  currentUser={user!}
                  onTakeIssue={handleTakeIssue}
                  onOpenAssignDialog={handleOpenAssignDialog}
                  onOpenStatusDialog={handleOpenStatusDialog}
                />

                <IssuesPagination
                  currentPage={filters.page || 1}
                  pageSize={filters.pageSize || 20}
                  total={issuesTotal}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AssignIssueDialog
        issue={selectedIssue}
        users={users}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssign={handleAssignIssue}
        isLoading={isAssigning}
      />

      <ChangeStatusDialog
        issue={selectedIssue}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onChangeStatus={handleChangeStatus}
        isLoading={isChangingStatus}
      />
    </AppShell>
  );
}
