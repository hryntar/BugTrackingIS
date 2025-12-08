import { useQuery } from "@tanstack/react-query";
import { ExternalLink, GitCommit, GitPullRequest, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { issueService } from "@/services/issue.service";
import type { CodeChange, CodeChangeType } from "@/lib/types";

interface IssueCodeChangesProps {
  issueId: number;
}

const getTypeIcon = (type: CodeChangeType) => {
  switch (type) {
    case "COMMIT":
      return <GitCommit className="h-4 w-4" />;
    case "PULL_REQUEST":
      return <GitPullRequest className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: CodeChangeType) => {
  switch (type) {
    case "COMMIT":
      return "Commit";
    case "PULL_REQUEST":
      return "Pull Request";
  }
};

const getTypeBadgeVariant = (type: CodeChangeType): "default" | "secondary" => {
  switch (type) {
    case "COMMIT":
      return "secondary";
    case "PULL_REQUEST":
      return "default";
  }
};

export function IssueCodeChanges({ issueId }: IssueCodeChangesProps) {
  const { data: codeChanges = [], isLoading } = useQuery({
    queryKey: ["codeChanges", issueId],
    queryFn: () => issueService.getCodeChanges(issueId),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Code Changes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : codeChanges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No code changes linked to this issue yet.</p>
        ) : (
          <div className="space-y-3">
            {codeChanges.map((change: CodeChange) => (
              <div key={change.id} className="group relative rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">{getTypeIcon(change.type)}</div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getTypeBadgeVariant(change.type)}>{getTypeLabel(change.type)}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">{change.externalId.substring(0, 7)}</span>
                      </div>
                      <a
                        href={change.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div>
                      <p className="text-sm font-medium leading-snug">{change.title}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">{change.author}</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(change.occurredAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
