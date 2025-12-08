import { Loader2 } from "lucide-react";

interface IssuesLoadingProps {
  message?: string;
}

export function IssuesLoading({ message = "Loading issues..." }: IssuesLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
