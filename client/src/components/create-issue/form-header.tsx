import { Bug } from "lucide-react";

export function FormHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Bug className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Issue</h1>
          <p className="text-muted-foreground">Report a bug or issue in the system</p>
        </div>
      </div>
    </div>
  );
}
