"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeightChart({ data }: { data: Array<{ date: string; weight: number }> }) {
  const [mounted, setMounted] = useState(false);
  const formatted = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    weight: item.weight
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-72 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4">
      <div className="mb-4">
        <p className="font-black text-white">Evolução do peso corporal</p>
        <p className="text-sm text-[var(--muted)]">Registros mais recentes por data</p>
      </div>
      {mounted ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="weight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#36f58a" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#36f58a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#26312d" vertical={false} />
            <XAxis dataKey="date" stroke="#95a39b" tickLine={false} axisLine={false} />
            <YAxis stroke="#95a39b" tickLine={false} axisLine={false} width={36} />
            <Tooltip contentStyle={{ background: "#111615", border: "1px solid #26312d", color: "#fff" }} />
            <Area type="monotone" dataKey="weight" stroke="#36f58a" fill="url(#weight)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="grid h-[220px] place-items-center text-sm text-[var(--muted)]">Carregando gráfico</div>
      )}
    </div>
  );
}
