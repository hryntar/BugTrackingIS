import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { CreateIssueForm } from "@/components/create-issue-form";

export const Route = createFileRoute("/issues/new")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: CreateIssuePage,
});

function CreateIssuePage() {
  return (
    <AppShell>
      <CreateIssueForm />
    </AppShell>
  );
}
