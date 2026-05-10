import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import type { ApiUser } from "@fitplanner/shared";
import { apiFetch, loginRequest, registerRequest } from "@/lib/api";
import { initializeLocalDatabase } from "@/lib/local-db";

type AuthContextValue = {
  token: string | null;
  user: ApiUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      await initializeLocalDatabase();
      const storedToken = await SecureStore.getItemAsync("fitplanner.token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const me = await apiFetch<ApiUser>("/auth/me", { token: storedToken });
          setUser(me);
        } catch {
          await SecureStore.deleteItemAsync("fitplanner.token");
          setToken(null);
        }
      }
      setIsLoading(false);
    }

    bootstrap();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isLoading,
      async login(email, password) {
        const result = await loginRequest(email, password);
        await SecureStore.setItemAsync("fitplanner.token", result.token);
        setToken(result.token);
        setUser(result.user);
      },
      async register(name, email, password) {
        const result = await registerRequest(name, email, password);
        await SecureStore.setItemAsync("fitplanner.token", result.token);
        setToken(result.token);
        setUser(result.user);
      },
      async logout() {
        await SecureStore.deleteItemAsync("fitplanner.token");
        setToken(null);
        setUser(null);
      }
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
