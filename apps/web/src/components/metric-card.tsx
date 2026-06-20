export function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="fitness-card min-w-0 p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-black uppercase text-[var(--muted)] md:text-xs">{label}</p>
        <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
      </div>
      <p className="mt-3 text-3xl font-black leading-none text-white md:text-4xl">{value}</p>
      <p className="mt-3 text-xs leading-5 text-[var(--muted)] md:text-sm">{detail}</p>
    </div>
  );
}
