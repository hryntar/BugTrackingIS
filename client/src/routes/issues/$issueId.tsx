import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { issueService } from "@/services/issue.service";
import { userService } from "@/services/user.service";
import { AppShell } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PriorityBadge } from "@/components/priority-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { IssueWorkflowActions } from "@/components/issue-workflow-actions";
import { IssueComments } from "@/components/issue-comments";
import { IssueCodeChanges } from "@/components/issue-code-changes";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/issues/$issueId")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: IssueDetailPage,
});

function IssueDetailPage() {
  const { issueId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: issue,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => issueService.getIssueById(Number(issueId)),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (error || !issue) {
    return (
      <AppShell>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Not Found</CardTitle>
              <CardDescription>The requested issue could not be found.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: "/" })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Issues
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-muted-foreground">{issue.key}</span>
                      <StatusBadge status={issue.status} />
                    </div>
                    <CardTitle className="text-2xl">{issue.title}</CardTitle>
                  </div>
                </div>

                <IssueWorkflowActions issue={issue} currentUser={user} users={users} isWatching={issue.isWatching || false} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Priority</div>
                  <PriorityBadge priority={issue.priority} />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Severity</div>
                  <SeverityBadge severity={issue.severity} />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Reporter</div>
                  <div className="text-sm">{issue.reporter.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Assignee</div>
                  <div className="text-sm">{issue.assignee?.name || "Unassigned"}</div>
                </div>
                {issue.environment && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Environment</div>
                    <div className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">{issue.environment}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
                  <div className="text-sm">
                    {new Date(issue.createdAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Updated</div>
                  <div className="text-sm">
                    {new Date(issue.updatedAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4">
                  <p className="whitespace-pre-wrap text-sm">{issue.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <IssueCodeChanges issueId={Number(issueId)} />

          <IssueComments issueId={Number(issueId)} currentUser={user} />
        </div>
      </div>
    </AppShell>
  );
}
