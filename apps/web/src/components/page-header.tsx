export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex flex-col justify-between gap-3 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:gap-4 md:pb-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[var(--neon)] md:text-sm">FitPlanner</p>
        <h1 className="mt-2 text-2xl font-black text-white md:text-3xl">{title}</h1>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-right">{subtitle}</p>
    </header>
  );
}
