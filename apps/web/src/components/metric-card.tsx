export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
      <p className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] md:text-xs">{label}</p>
      <p className="mt-3 text-2xl font-black text-white md:text-3xl">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)] md:text-sm">{detail}</p>
    </div>
  );
}
