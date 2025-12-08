import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { SeverityBadge } from "@/components/severity-badge";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { Issue, User } from "@/lib/types";
import { format } from "date-fns";

interface IssuesTableProps {
  issues: Issue[];
  currentUser: User;
  onTakeIssue?: (id: number) => void;
  onOpenAssignDialog?: (issue: Issue) => void;
  onOpenStatusDialog?: (issue: Issue) => void;
}

export function IssuesTable({ issues, currentUser, onTakeIssue, onOpenAssignDialog, onOpenStatusDialog }: IssuesTableProps) {
  const navigate = useNavigate();

  const canTakeIssue = (issue: Issue) => {
    return currentUser.role === "DEV" && issue.status === "NEW" && !issue.assignee;
  };

  const canManageIssue = () => {
    return currentUser.role === "QA" || currentUser.role === "PM";
  };

  const handleRowClick = (issueId: number) => {
    navigate({ to: `/issues/${issueId}` });
  };

  if (issues.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No issues found</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Key</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id} className="cursor-pointer" onClick={() => handleRowClick(issue.id)}>
              <TableCell className="font-mono font-medium text-primary">{issue.key}</TableCell>
              <TableCell className="font-medium">{issue.title}</TableCell>
              <TableCell>
                <StatusBadge status={issue.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={issue.priority} />
              </TableCell>
              <TableCell>
                <SeverityBadge severity={issue.severity} />
              </TableCell>
              <TableCell>{issue.reporter.name}</TableCell>
              <TableCell>{issue.assignee ? issue.assignee.name : <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
              <TableCell className="text-muted-foreground">{format(new Date(issue.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                {(canTakeIssue(issue) || canManageIssue()) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canTakeIssue(issue) && onTakeIssue && (
                        <>
                          <DropdownMenuItem onClick={() => onTakeIssue(issue.id)}>Take Issue</DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {canManageIssue() && (
                        <>
                          {onOpenAssignDialog && <DropdownMenuItem onClick={() => onOpenAssignDialog(issue)}>Assign</DropdownMenuItem>}
                          {onOpenStatusDialog && <DropdownMenuItem onClick={() => onOpenStatusDialog(issue)}>Change Status</DropdownMenuItem>}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
