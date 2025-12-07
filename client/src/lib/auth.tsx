import { createContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "@/services/auth.service";
import type { User } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(() => {
    return !!authService.getToken();
  });

  const fetchUser = async () => {
    const token = authService.getToken();

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch {
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      return;
    }

    authService
      .getCurrentUser()
      .then((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch(() => {
        authService.removeToken();
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, isLoading, refetch: fetchUser }}>{children}</AuthContext.Provider>;
}

AuthProvider.displayName = "AuthProvider";

export { AuthContext };
