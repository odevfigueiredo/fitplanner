"use client";

import { PageHeader } from "@/components/page-header";
import { fallbackWorkoutLogs } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

type WorkoutLog = {
  id: string;
  date: string;
  durationMinutes: number;
  notes?: string | null;
  workout: { name: string };
  exercises: Array<{ id: string; exercise: { name: string }; weightUsed?: number | null; perceivedEffort: number }>;
};

export default function HistoryPage() {
  const { data } = useResource<WorkoutLog[]>("/workout-logs", fallbackWorkoutLogs);

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Histórico de treinos" subtitle="Sessões concluídas com duração, exercícios, carga utilizada e esforço percebido." />
      <section className="grid gap-4">
        {data.length === 0 ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-8 text-center text-[var(--muted)]">Nenhum treino registrado ainda.</div>
        ) : (
          data.map((log) => (
            <article key={log.id} className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
              <div className="flex flex-col justify-between gap-2 md:flex-row">
                <div>
                  <h2 className="text-xl font-black text-white">{log.workout.name}</h2>
                  <p className="text-sm text-[var(--muted)]">{new Date(log.date).toLocaleDateString()} | {log.durationMinutes} minutos</p>
                </div>
                <span className="font-black text-[var(--neon)]">{log.exercises.length} exercícios</span>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {log.exercises.map((item) => (
                  <div key={item.id} className="rounded-lg bg-[var(--panel-2)] p-3">
                    <p className="font-bold text-white">{item.exercise.name}</p>
                  <p className="text-sm text-[var(--muted)]">{item.weightUsed ?? "--"}kg | esforço {item.perceivedEffort}/10</p>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
