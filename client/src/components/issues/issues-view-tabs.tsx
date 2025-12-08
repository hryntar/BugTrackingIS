import { Button } from "@/components/ui/button";
import type { IssueListView } from "@/lib/types";
import { List, User, Eye, Inbox } from "lucide-react";

interface IssuesViewTabsProps {
  view: IssueListView;
  onViewChange: (view: IssueListView) => void;
}

const views = [
  { value: "all" as const, label: "All Issues", icon: List },
  { value: "my" as const, label: "My Issues", icon: User },
  { value: "reported" as const, label: "Reported by Me", icon: Inbox },
  { value: "watching" as const, label: "Watching", icon: Eye },
];

export function IssuesViewTabs({ view, onViewChange }: IssuesViewTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = view === v.value;

        return (
          <Button
            key={v.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange(v.value)}
            className="gap-2 whitespace-nowrap"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{v.label}</span>
            <span className="sm:hidden">{v.label.split(" ")[0]}</span>
          </Button>
        );
      })}
    </div>
  );
}
