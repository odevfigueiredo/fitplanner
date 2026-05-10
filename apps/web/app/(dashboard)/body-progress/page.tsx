"use client";

import { useState } from "react";
import { MetricLineChart } from "@/components/metric-line-chart";
import { PageHeader } from "@/components/page-header";
import { apiFetch, getStoredToken } from "@/lib/api";
import { fallbackBodyProgress } from "@/lib/mock";
import { useResource } from "@/lib/use-resource";

type BodyProgress = {
  id: string;
  weight: number;
  height?: number | null;
  bodyFat?: number | null;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  arms?: number | null;
  thighs?: number | null;
  date: string;
};

export default function BodyProgressPage() {
  const { data, reload } = useResource<BodyProgress[]>("/body-progress", fallbackBodyProgress);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const chartData = data.map((item) => ({
    label: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    value: item.weight,
  }));

  async function submit() {
    await apiFetch("/body-progress", {
      token: getStoredToken(),
      method: "POST",
      body: {
        weight: Number(weight),
        waist: waist ? Number(waist) : null,
        bodyFat: bodyFat ? Number(bodyFat) : null,
        date: new Date().toISOString(),
      },
    });
    setWeight("");
    setWaist("");
    setBodyFat("");
    await reload();
  }

  return (
    <div className="grid gap-5 md:gap-6">
      <PageHeader title="Progresso corporal" subtitle="Registros de peso, gordura corporal e medidas para acompanhar evolução física." />
      <MetricLineChart title="Peso corporal" subtitle="Evolução real a partir dos registros salvos." data={chartData} unit="kg" />
      <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
        <h2 className="font-black text-white">Nova medida</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <input value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="Peso kg" className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none" />
          <input value={waist} onChange={(event) => setWaist(event.target.value)} placeholder="Cintura cm" className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none" />
          <input value={bodyFat} onChange={(event) => setBodyFat(event.target.value)} placeholder="Gordura corporal %" className="h-11 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-4 text-white outline-none" />
          <button onClick={submit} className="h-11 rounded-lg bg-[var(--neon)] px-5 font-black text-black">Salvar</button>
        </div>
      </section>
      <section className="grid gap-3 md:hidden">
        {data.map((item) => (
          <article key={item.id} className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-white">{new Date(item.date).toLocaleDateString("pt-BR")}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Gordura {item.bodyFat ?? "--"}% | Cintura {item.waist ?? "--"}cm</p>
              </div>
              <span className="rounded-full bg-[rgba(57,255,136,0.12)] px-3 py-1 text-sm font-black text-[var(--neon)]">{item.weight}kg</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-[var(--panel-2)] p-3">
                <p className="text-xs text-[var(--muted)]">Peito</p>
                <p className="font-bold text-white">{item.chest ?? "--"}cm</p>
              </div>
              <div className="rounded-lg bg-[var(--panel-2)] p-3">
                <p className="text-xs text-[var(--muted)]">Braços</p>
                <p className="font-bold text-white">{item.arms ?? "--"}cm</p>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="hidden overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--panel-2)] text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3">Data</th>
              <th>Peso</th>
              <th>Gordura corporal</th>
              <th>Cintura</th>
              <th>Peito</th>
              <th>Braços</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-[var(--line)]">
                <td className="px-5 py-4 font-bold text-white">{new Date(item.date).toLocaleDateString("pt-BR")}</td>
                <td>{item.weight}kg</td>
                <td>{item.bodyFat ?? "--"}%</td>
                <td>{item.waist ?? "--"}cm</td>
                <td>{item.chest ?? "--"}cm</td>
                <td>{item.arms ?? "--"}cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
