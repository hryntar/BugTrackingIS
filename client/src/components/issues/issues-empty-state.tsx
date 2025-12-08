import { FileQuestion } from "lucide-react";

interface IssuesEmptyStateProps {
  view: string;
}

export function IssuesEmptyState({ view }: IssuesEmptyStateProps) {
  const messages = {
    all: "No issues found. Start by creating your first issue.",
    my: "You don't have any assigned issues yet.",
    reported: "You haven't reported any issues yet.",
    watching: "You're not watching any issues yet.",
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="rounded-full bg-muted p-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">No issues found</h3>
        <p className="text-sm text-muted-foreground max-w-md">{messages[view as keyof typeof messages] || messages.all}</p>
      </div>
    </div>
  );
}
