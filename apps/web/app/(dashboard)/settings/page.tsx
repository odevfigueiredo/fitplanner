"use client";

import type { ApiUser } from "@fitplanner/shared";
import { PageHeader } from "@/components/page-header";
import { fallbackUser } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function SettingsPage() {
  const { data: user } = useResource<ApiUser>("/auth/me", fallbackUser);

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Ajustes" subtitle="Dados da conta, ambiente conectado e informações do painel." />
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-[var(--neon)] text-xl font-black text-black">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-black text-white">{user.name}</p>
              <p className="truncate text-sm text-[var(--muted)]">{user.email}</p>
            </div>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--panel-2)] p-3">
              <dt className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">Usuário desde</dt>
              <dd className="mt-1 text-sm font-bold text-white">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="rounded-lg bg-[var(--panel-2)] p-3">
              <dt className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">Status</dt>
              <dd className="mt-1 text-sm font-bold text-[var(--neon)]">Conta ativa</dd>
            </div>
            <div className="rounded-lg bg-[var(--panel-2)] p-3 sm:col-span-2">
              <dt className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">ID</dt>
              <dd className="mt-1 break-all text-sm font-bold text-white">{user.id}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <p className="font-black text-white">API URL</p>
          <p className="mt-2 break-all text-sm text-[var(--muted)]">{process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"}</p>
        </div>
      </section>
    </div>
  );
}
