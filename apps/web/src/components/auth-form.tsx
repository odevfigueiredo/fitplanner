"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, register, setStoredToken } from "@/lib/api";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "teste@fitplanner.app" : "novo@fitplanner.app");
  const [password, setPassword] = useState(mode === "login" ? "123456" : "password123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = mode === "login" ? await login(email, password) : await register(name, email, password);
      setStoredToken(result.token);
      router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha na autenticação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {mode === "register" ? (
        <label className="grid gap-2 text-sm font-bold text-[var(--muted)]">
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-4 text-white outline-none focus:border-[var(--neon)]"
            required
          />
        </label>
      ) : null}
      <label className="grid gap-2 text-sm font-bold text-[var(--muted)]">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-4 text-white outline-none focus:border-[var(--neon)]"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[var(--muted)]">
        Senha
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-lg border border-[var(--line)] bg-[var(--panel)] px-4 text-white outline-none focus:border-[var(--neon)]"
          required
        />
      </label>
      {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-lg bg-[var(--neon)] px-5 font-black text-black disabled:opacity-60"
      >
        {isSubmitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
      </button>
    </form>
  );
}
