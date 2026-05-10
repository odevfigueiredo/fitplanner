"use client";

import { workoutTypes } from "@fitplanner/shared";
import { PageHeader } from "@/components/page-header";
import { getMuscleImage, getTrainingTypeImage } from "@/lib/assets";
import { fallbackWorkouts } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

type Workout = (typeof fallbackWorkouts)[number];

export default function WorkoutsPage() {
  const { data } = useResource<Workout[]>("/workouts", fallbackWorkouts);

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Treinos" subtitle="Planos de treino com exercícios, séries, repetições, descanso e carga alvo." />
      <section className="no-scrollbar grid grid-flow-col auto-cols-[220px] gap-3 overflow-x-auto md:grid-flow-row md:grid-cols-3 md:overflow-visible xl:grid-cols-5">
        {workoutTypes.map((type) => (
          <div key={type} className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)]">
            <img src={getTrainingTypeImage(type)} alt="" className="aspect-video w-full object-cover" />
            <p className="p-3 text-sm font-black text-white">{type}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-4">
        {data.map((workout) => (
          <article key={workout.id} className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)]">
            <div className="grid gap-4 p-4 md:grid-cols-[184px_1fr_auto] md:items-start md:p-5">
              <img src={getTrainingTypeImage(workout.type)} alt="" className="aspect-video w-full rounded-lg object-cover md:w-44" />
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--neon)]">{workout.type}</p>
                <h2 className="mt-2 text-xl font-black text-white">{workout.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{workout.description}</p>
              </div>
              <span className="w-fit rounded-full bg-[var(--neon)] px-3 py-1 text-xs font-black text-black">{workout.exercises.length} exercícios</span>
            </div>
            <div className="grid gap-2 border-t border-[var(--line)] p-4 md:hidden">
              {workout.exercises.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-[var(--panel-2)] p-3">
                  <img src={getMuscleImage(item.exercise.muscleGroup)} alt="" className="h-11 w-11 rounded-lg bg-[var(--panel)] object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white">{item.exercise.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {item.sets}x{item.reps} | {item.restSeconds}s | {item.targetWeight ?? "--"}kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden overflow-x-auto border-t border-[var(--line)] md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="px-5 py-3">Exercício</th>
                    <th>Grupo</th>
                    <th>Séries</th>
                    <th>Repetições</th>
                    <th>Descanso</th>
                    <th>Meta</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.exercises.map((item) => (
                    <tr key={item.id} className="border-t border-[var(--line)]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={getMuscleImage(item.exercise.muscleGroup)} alt="" className="h-10 w-10 rounded-lg bg-[var(--panel-2)] object-contain" />
                          <span className="font-bold text-white">{item.exercise.name}</span>
                        </div>
                      </td>
                      <td>{item.exercise.muscleGroup}</td>
                      <td>{item.sets}</td>
                      <td>{item.reps}</td>
                      <td>{item.restSeconds}s</td>
                      <td>{item.targetWeight ?? "--"}kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
