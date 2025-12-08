import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IssueSeverity } from "@/lib/types";

const severityConfig: Record<IssueSeverity, { label: string; className: string }> = {
  TRIVIAL: {
    label: "Trivial",
    className: "bg-gray-400 text-white hover:bg-gray-500",
  },
  MINOR: {
    label: "Minor",
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
  MAJOR: {
    label: "Major",
    className: "bg-orange-500 text-white hover:bg-orange-600",
  },
  CRITICAL: {
    label: "Critical",
    className: "bg-red-600 text-white hover:bg-red-700",
  },
};

interface SeverityBadgeProps {
  severity: IssueSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return <Badge className={cn("border-transparent", config.className, className)}>{config.label}</Badge>;
}
