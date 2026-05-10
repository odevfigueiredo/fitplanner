import type { AuthResponse } from "@fitplanner/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("fitplanner.token");
}

export function setStoredToken(token: string) {
  window.localStorage.setItem("fitplanner.token", token);
}

export function clearStoredToken() {
  window.localStorage.removeItem("fitplanner.token");
}

export async function apiFetch<T>(path: string, options: { method?: string; body?: unknown; token?: string | null } = {}) {
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

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", { method: "POST", body: { email, password } });
}

export function register(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password } });
}
