"use client";

import clsx from "clsx";
import { Activity, Dumbbell, History, LayoutDashboard, LineChart, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredToken } from "@/lib/api";

const items = [
  { href: "/dashboard", label: "Painel", shortLabel: "Painel", icon: LayoutDashboard },
  { href: "/workouts", label: "Treinos", shortLabel: "Treinos", icon: Dumbbell },
  { href: "/exercises", label: "Exercícios", shortLabel: "Exerc.", icon: Activity },
  { href: "/history", label: "Histórico", shortLabel: "Hist.", icon: History },
  { href: "/body-progress", label: "Progresso corporal", shortLabel: "Corpo", icon: LineChart },
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
      <aside className="hidden w-72 min-w-72 flex-col justify-between border-r border-[var(--line)] bg-[#0c100f] p-4 lg:flex lg:min-h-screen">
        <div className="grid gap-8">
          <div className="flex items-center gap-3">
            <img src="/assets/fitplanner-mark.png" alt="" className="h-12 w-12 rounded-lg border border-[var(--line)] object-cover" />
            <div>
              <p className="text-2xl font-black text-white">FitPlanner</p>
              <p className="text-sm text-[var(--muted)]">Painel de treinos</p>
            </div>
          </div>
          <nav className="grid gap-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition",
                    active ? "bg-[var(--neon)] text-black" : "text-[var(--muted)] hover:bg-[var(--panel)] hover:text-white",
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button onClick={logout} className="w-full rounded-lg border border-[var(--line)] px-4 py-3 text-sm font-bold text-white hover:border-[var(--neon)]">
          Sair
        </button>
      </aside>

      <header className="sticky top-0 z-40 flex w-full max-w-[100vw] items-center justify-between border-b border-[var(--line)] bg-[#0c100f]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <img src="/assets/fitplanner-mark.png" alt="" className="h-10 w-10 rounded-lg border border-[var(--line)] object-cover" />
          <div className="min-w-0">
            <p className="text-lg font-black leading-tight text-white">FitPlanner</p>
            <p className="truncate text-xs text-[var(--muted)]">{currentItem?.label}</p>
          </div>
        </div>
        <button
          onClick={logout}
          aria-label="Sair"
          className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:border-[var(--neon)] hover:text-white"
        >
          <LogOut size={18} />
        </button>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 w-screen max-w-[100vw] border-t border-[var(--line)] bg-[#0c100f]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-6 gap-1">
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
                  active ? "bg-[var(--neon)] text-black" : "text-[var(--muted)] active:bg-[var(--panel)] active:text-white",
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
