import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IssueStatus } from "@/lib/types";

const statusConfig: Record<IssueStatus, { label: string; className: string }> = {
  NEW: {
    label: "New",
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-yellow-500 text-white hover:bg-yellow-600",
  },
  READY_FOR_QA: {
    label: "Ready for QA",
    className: "bg-purple-500 text-white hover:bg-purple-600",
  },
  REOPENED: {
    label: "Reopened",
    className: "bg-orange-500 text-white hover:bg-orange-600",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-green-500 text-white hover:bg-green-600",
  },
};

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge className={cn("border-transparent", config.className, className)}>{config.label}</Badge>;
}
