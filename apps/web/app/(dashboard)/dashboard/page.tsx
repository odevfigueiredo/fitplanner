"use client";

import { guideSteps, type DashboardSummary } from "@fitplanner/shared";
import Link from "next/link";
import { MetricLineChart } from "@/components/metric-line-chart";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { getTrainingTypeImage } from "@/lib/assets";
import { fallbackDashboard } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

export default function DashboardPage() {
  const { data } = useResource<DashboardSummary>("/dashboard/summary", fallbackDashboard);
  const weightChartData = data.bodyWeightTrend.map((item) => ({
    label: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    value: item.weight,
  }));
  const loadChartData = data.exerciseLoadTrend
    .filter((item) => item.weightUsed !== null)
    .slice(-8)
    .map((item) => ({
      label: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: item.weightUsed ?? 0,
    }));
  const guideFocus =
    data.science.weeklyMuscleSets.find((item) => item.status === "low" || item.status === "high")?.message ??
    data.science.recommendations[0]?.action ??
    "Crie um treino simples, registre a sessão e revise seu progresso depois.";
  const nextWorkout = data.weeklyWorkouts[0];

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Painel" subtitle="Métricas de treino, sequência, carga e evolução corporal em uma visão rápida." />

      <section className="fitness-card grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[260px]">
          <img src={getTrainingTypeImage(nextWorkout?.type ?? "Strength")} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
          <div className="relative flex h-full min-h-[260px] flex-col justify-end p-5 md:p-7">
            <p className="text-xs font-black uppercase text-[var(--accent)]">Próximo treino</p>
            <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight text-white md:text-5xl">
              {nextWorkout?.name ?? "Monte seu próximo treino"}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-200">
              {nextWorkout
                ? `${nextWorkout.exerciseCount} exercícios planejados para manter volume, carga e consistência no trilho.`
                : "Crie um treino e deixe a sessão pronta antes de chegar à academia."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/workouts" className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[var(--accent-2)]">
                Ver treinos
              </Link>
              <Link href="/history" className="rounded-lg border border-white/20 bg-black/20 px-4 py-2.5 text-sm font-black text-white transition hover:border-white/50">
                Histórico
              </Link>
            </div>
          </div>
        </div>
        <div className="grid content-between gap-4 p-5 md:p-7">
          <div>
            <p className="text-xs font-black uppercase text-[var(--muted)]">Resumo da semana</p>
            <p className="mt-2 text-2xl font-black text-white">Consistência primeiro, carga depois.</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Use o painel para enxergar frequência, esforço e grupos musculares sem perder tempo entre telas.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="fitness-subcard p-3">
              <p className="text-xs font-bold text-[var(--muted)]">Treinos</p>
              <p className="mt-1 text-2xl font-black text-white">{data.totalWorkoutsThisMonth}</p>
            </div>
            <div className="fitness-subcard p-3">
              <p className="text-xs font-bold text-[var(--muted)]">Streak</p>
              <p className="mt-1 text-2xl font-black text-white">{data.workoutStreak}d</p>
            </div>
            <div className="fitness-subcard p-3">
              <p className="text-xs font-bold text-[var(--muted)]">RPE</p>
              <p className="mt-1 text-2xl font-black text-white">{data.cards.averageEffort ?? "--"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        <MetricCard label="Este mês" value={`${data.totalWorkoutsThisMonth}`} detail="treinos registrados" />
        <MetricCard label="Sequência" value={`${data.workoutStreak}`} detail="dias de treino" />
        <MetricCard label="Peso atual" value={data.cards.currentWeight ? `${data.cards.currentWeight}kg` : "--"} detail="último registro corporal" />
        <MetricCard label="Esforço médio" value={data.cards.averageEffort ? `${data.cards.averageEffort}/10` : "--"} detail="registros de exercício" />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-2">
        <MetricLineChart title="Evolução de peso corporal" subtitle="Linha real baseada nos registros de medidas." data={weightChartData} unit="kg" />
        <MetricLineChart title="Evolução de carga" subtitle={data.exerciseLoadTrend.at(-1)?.exerciseName ?? "Carga usada por exercício"} data={loadChartData} unit="kg" color="#8cffd2" />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-white">Último treino</p>
            <Link href="/history" className="text-sm font-black text-[var(--neon)]">Ver histórico</Link>
          </div>
          <div className="mt-4 rounded-lg bg-[var(--panel-2)] p-4">
            {data.lastWorkout ? (
              <>
                <p className="text-xl font-black text-[var(--neon)] md:text-2xl">{data.lastWorkout.workoutName}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {new Date(data.lastWorkout.date).toLocaleDateString("pt-BR")} | {data.lastWorkout.durationMinutes} minutos
                </p>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Nenhum treino registrado ainda.</p>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <p className="font-black text-white">Exercícios mais realizados</p>
          <div className="mt-4 grid gap-3">
            {data.mostPerformedExercises.map((item) => (
              <div key={item.exerciseId} className="flex items-center justify-between rounded-lg bg-[var(--panel-2)] p-3">
                <span className="font-bold text-white">{item.exerciseName}</span>
                <span className="font-black text-[var(--neon)]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <img src="/assets/guide-coach.png" alt="" className="mb-4 aspect-[16/7] w-full rounded-lg object-cover" />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--neon)]">Guia rápido</p>
              <h2 className="mt-2 text-xl font-black text-white">O que fazer agora</h2>
            </div>
            <span className="rounded-full bg-[var(--panel-2)] px-3 py-1 text-xs font-black text-white">3 passos</span>
          </div>
          <div className="mt-4 grid gap-2">
            {guideSteps.map((item, index) => (
              <article key={item.id} className="flex gap-3 rounded-lg bg-[var(--panel-2)] p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--neon)] text-xs font-black text-black">{index + 1}</span>
                <div>
                  <p className="font-black text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{item.action}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-[rgba(54,245,138,0.25)] bg-[rgba(54,245,138,0.08)] p-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--neon)]">Foco</p>
            <p className="mt-1 text-sm leading-6 text-white">{guideFocus}</p>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
          <p className="font-black text-white">Volume semanal por grupo</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Soma de séries planejadas nos treinos da semana.</p>
          <div className="mt-4 grid gap-3">
            {data.science.weeklyMuscleSets.length > 0 ? data.science.weeklyMuscleSets.slice(0, 8).map((item) => {
              const width = Math.min(100, Math.max(8, (item.sets / 20) * 100));
              const tone = item.status === "low" ? "bg-amber-300" : item.status === "high" ? "bg-red-300" : "bg-[var(--neon)]";
              return (
                <div key={item.muscleGroup} className="rounded-lg bg-[var(--panel-2)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-white">{item.muscleGroup}</span>
                    <span className="text-sm font-black text-[var(--neon)]">{item.sets} séries</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/30">
                    <div className={`h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{item.message}</p>
                </div>
              );
            }) : (
              <p className="rounded-lg border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
                Crie treinos com exercícios para receber análise de volume.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
        <p className="font-black text-white">Treinos da semana</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.weeklyWorkouts.map((workout) => (
            <div key={workout.id} className="flex gap-3 rounded-lg bg-[var(--panel-2)] p-3 md:gap-4 md:p-4">
              <img src={getTrainingTypeImage(workout.type)} alt="" className="aspect-video w-24 shrink-0 rounded-lg object-cover md:w-28" />
              <div className="min-w-0">
                <p className="truncate text-base font-black text-white md:text-lg">{workout.name}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-[var(--neon)]">{workout.type}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{workout.exerciseCount} exercícios | dia {workout.dayOfWeek ?? "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
