import type { AuthResponse } from "@fitplanner/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

type ApiOptions = {
  token?: string | null;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function loginRequest(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", { method: "POST", body: { email, password } });
}

export function registerRequest(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password } });
}
