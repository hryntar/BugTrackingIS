import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-bold">Bug Tracking System</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => logout()} disabled={isPending}>
              {isPending ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h2>
            <p className="text-muted-foreground">Here's an overview of your bug tracking workspace</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Issues</CardTitle>
                <CardDescription>All tracked bugs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Issues</CardTitle>
                <CardDescription>Currently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolved</CardTitle>
                <CardDescription>Completed bugs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Your bug tracking dashboard is ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">This is a placeholder dashboard. Future features will include:</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Issue list and management</li>
                <li>Bug status tracking and workflows</li>
                <li>Comments and collaboration</li>
                <li>GitHub integration for code changes</li>
                <li>User and team management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
