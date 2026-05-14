"use client";

import { useState } from "react";
import { muscleGroups } from "@fitplanner/shared";
import { PageHeader } from "@/components/page-header";
import { apiFetch, getStoredToken } from "@/lib/api";
import { getMuscleImage } from "@/lib/assets";
import { fallbackExercises } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

type Exercise = (typeof fallbackExercises)[number];

export default function ExercisesPage() {
  const { data, reload } = useResource<Exercise[]>("/exercises", fallbackExercises);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Chest");

  async function createExercise() {
    await apiFetch("/exercises", {
      token: getStoredToken(),
      method: "POST",
      body: { name, muscleGroup, equipment: "Personalizado", instructions: "" },
    });
    setName("");
    await reload();
  }

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Exercícios" subtitle="Biblioteca global e exercícios personalizados por usuário." />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {muscleGroups.map((group) => (
          <div key={group} className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-3">
            <img src={getMuscleImage(group)} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-[var(--panel-2)] object-contain md:h-14 md:w-14" />
            <p className="truncate text-sm font-black text-white md:text-base">{group}</p>
          </div>
        ))}
      </section>
      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
        <h2 className="font-black text-white">Criar exercício personalizado</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_auto]">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do exercício" className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none" />
          <select value={muscleGroup} onChange={(event) => setMuscleGroup(event.target.value)} className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none">
            {muscleGroups.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </select>
          <button onClick={createExercise} className="h-11 rounded-lg bg-[var(--neon)] px-5 font-black text-black">Criar</button>
        </div>
      </section>
      <section className="grid gap-3 md:hidden">
        {data.map((exercise) => (
          <article key={exercise.id} className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-3">
            <img src={getMuscleImage(exercise.muscleGroup)} alt="" className="h-14 w-14 rounded-lg bg-[var(--panel-2)] object-contain" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-black text-white">{exercise.name}</p>
              <p className="text-sm text-[var(--muted)]">{exercise.muscleGroup} | {exercise.equipment ?? "--"}</p>
              <p className="text-xs font-black text-[var(--neon)]">{exercise.userId ? "Personalizado" : "Global"}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="hidden overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[var(--panel-2)] text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3">Exercício</th>
              <th>Grupo muscular</th>
              <th>Equipamento</th>
              <th>Padrao</th>
              <th>Escopo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((exercise) => (
              <tr key={exercise.id} className="border-t border-[var(--line)]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={getMuscleImage(exercise.muscleGroup)} alt="" className="h-12 w-12 rounded-lg bg-[var(--panel-2)] object-contain" />
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
