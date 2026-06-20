"use client";

import clsx from "clsx";
import { Activity, Dumbbell, Flame, LayoutDashboard, LineChart, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredToken } from "@/lib/api";

const items = [
  { href: "/dashboard", label: "Painel", shortLabel: "Painel", icon: LayoutDashboard },
  { href: "/workouts", label: "Treinos", shortLabel: "Treinos", icon: Dumbbell },
  { href: "/exercises", label: "Exercícios", shortLabel: "Exerc.", icon: Activity },
  { href: "/body-progress", label: "Corpo", shortLabel: "Corpo", icon: LineChart },
  { href: "/settings", label: "Ajustes", shortLabel: "Ajustes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentItem = items.find((item) => item.href === pathname) ?? items[0];

  function logout() {
    clearStoredToken();
    router.push("/login");
  }

  return (
    <>
      <aside className="hidden w-64 min-w-64 flex-col justify-between border-r border-[var(--line)] bg-[#0d0d0d] p-4 lg:flex lg:min-h-screen">
        <div className="grid gap-6">
          <div className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-3">
            <img src="/assets/fitplanner-mark.png" alt="" className="h-10 w-10 rounded-lg border border-[var(--line)] object-cover" />
            <div>
              <p className="text-xl font-black text-white">FitPlanner</p>
              <p className="text-xs font-bold text-[var(--muted)]">Treino e progresso</p>
            </div>
          </div>
          <nav className="grid gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-black transition",
                    active ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--panel)] hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="grid gap-3">
          <div className="rounded-lg border border-[rgba(252,76,2,0.28)] bg-[rgba(252,76,2,0.1)] p-3">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <Flame size={16} />
              <p className="text-xs font-black uppercase">Modo treino</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">Planeje, registre e revise cargas sem sair do fluxo.</p>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-black text-white hover:border-[var(--accent)]">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex w-full max-w-[100vw] items-center justify-between border-b border-[var(--line)] bg-[#0d0d0d]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/assets/fitplanner-mark.png" alt="" className="h-10 w-10 rounded-lg border border-[var(--line)] object-cover" />
          <div className="min-w-0">
            <p className="text-lg font-black leading-tight text-white">FitPlanner</p>
            <p className="truncate text-xs font-bold text-[var(--muted)]">{currentItem?.label}</p>
          </div>
        </div>
        <button
          onClick={logout}
          aria-label="Sair"
          className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-white"
        >
          <LogOut size={18} />
        </button>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 w-screen max-w-[100vw] border-t border-[var(--line)] bg-[#0d0d0d]/96 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={clsx(
                  "grid min-h-14 min-w-0 place-items-center gap-1 rounded-lg px-1 py-2 text-[9px] font-black leading-none transition",
                  active ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] active:bg-[var(--panel)] active:text-white",
                )}
              >
                <Icon size={18} />
                <span className="truncate">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
