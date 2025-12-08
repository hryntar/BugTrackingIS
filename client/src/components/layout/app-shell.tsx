import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AbstractBackground } from "@/components/ui/abstract-background";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AbstractBackground />
      <AppHeader />
      <main className="relative z-10 flex-1">{children}</main>
    </div>
  );
}
