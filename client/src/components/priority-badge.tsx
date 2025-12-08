import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IssuePriority } from "@/lib/types";

const priorityConfig: Record<IssuePriority, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "bg-gray-500 text-white hover:bg-gray-600",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-500 text-white hover:bg-orange-600",
  },
  CRITICAL: {
    label: "Critical",
    className: "bg-red-500 text-white hover:bg-red-600",
  },
};

interface PriorityBadgeProps {
  priority: IssuePriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return <Badge className={cn("border-transparent", config.className, className)}>{config.label}</Badge>;
}
