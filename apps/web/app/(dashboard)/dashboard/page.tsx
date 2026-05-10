"use client";

import type { DashboardSummary } from "@fitplanner/shared";
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

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Painel" subtitle="Métricas de treino, sequência, carga e evolução corporal em uma visão rápida." />

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
          <p className="font-black text-white">Último treino realizado</p>
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
