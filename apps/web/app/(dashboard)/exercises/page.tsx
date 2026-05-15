"use client";

import { useMemo, useState } from "react";
import { muscleGroups } from "@fitplanner/shared";
import { ExerciseBadge } from "@/components/exercise-badge";
import { PageHeader } from "@/components/page-header";
import { apiFetch, getStoredToken } from "@/lib/api";
import { fallbackExercises } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

type Exercise = (typeof fallbackExercises)[number];

export default function ExercisesPage() {
  const { data, reload } = useResource<Exercise[]>("/exercises", fallbackExercises);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Chest");
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [query, setQuery] = useState("");

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((exercise) => {
      const matchesGroup = selectedGroup === "Todos" || exercise.muscleGroup === selectedGroup;
      const matchesQuery =
        !normalizedQuery ||
        exercise.name.toLowerCase().includes(normalizedQuery) ||
        exercise.muscleGroup.toLowerCase().includes(normalizedQuery) ||
        (exercise.equipment ?? "").toLowerCase().includes(normalizedQuery);

      return matchesGroup && matchesQuery;
    });
  }, [data, query, selectedGroup]);

  async function createExercise() {
    if (!name.trim()) {
      return;
    }

    await apiFetch("/exercises", {
      token: getStoredToken(),
      method: "POST",
      body: { name, muscleGroup, equipment: "Personalizado", instructions: "" },
    });
    setName("");
    await reload();
  }

  return (
    <div className="grid gap-5">
      <PageHeader title="Exercícios" subtitle="Busque, filtre e crie exercícios sem poluir a tela." />

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, músculo ou equipamento"
            className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-sm text-white outline-none transition focus:border-[var(--neon)]"
          />
          <span className="text-sm font-bold text-[var(--muted)]">{filteredExercises.length} exercícios</span>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {["Todos", ...muscleGroups].map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setSelectedGroup(group)}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-black transition ${
                selectedGroup === group ? "bg-[var(--neon)] text-black" : "bg-[var(--panel-2)] text-[var(--muted)] hover:text-white"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
        <h2 className="font-black text-white">Criar exercício</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do exercício" className="h-11 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none focus:border-[var(--neon)] md:flex-1" />
          <select value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)} className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none focus:border-[var(--neon)] md:w-56">
            {muscleGroups.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </select>
          <button onClick={createExercise} className="h-11 rounded-lg bg-[var(--neon)] px-5 font-black text-black md:w-28">Criar</button>
        </div>
      </section>

      <section className="grid gap-2 md:hidden">
        {filteredExercises.map((exercise) => (
          <article key={exercise.id} className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-3">
            <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-black text-white">{exercise.name}</p>
              <p className="text-sm text-[var(--muted)]">{exercise.muscleGroup} · {exercise.equipment ?? "--"}</p>
            </div>
            <span className="text-xs font-black text-[var(--neon)]">{exercise.userId ? "Custom" : "Global"}</span>
          </article>
        ))}
      </section>

      <section className="hidden overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[var(--panel-2)] text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3">Exercício</th>
              <th>Grupo</th>
              <th>Equipamento</th>
              <th>Padrão</th>
              <th>Escopo</th>
            </tr>
          </thead>
          <tbody>
            {filteredExercises.map((exercise) => (
              <tr key={exercise.id} className="border-t border-[var(--line)]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
                    <span className="font-bold text-white">{exercise.name}</span>
                  </div>
                </td>
                <td>{exercise.muscleGroup}</td>
                <td>{exercise.equipment ?? "--"}</td>
                <td>{exercise.pattern ?? "--"}</td>
                <td className="font-bold text-[var(--neon)]">{exercise.userId ? "Personalizado" : "Global"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
