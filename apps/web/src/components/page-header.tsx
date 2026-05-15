export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex flex-col justify-between gap-2 border-b border-[var(--line)] pb-4 md:flex-row md:items-end md:gap-4 md:pb-5">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[var(--neon)]">FitPlanner</p>
        <h1 className="mt-1 text-2xl font-black text-white md:text-3xl">{title}</h1>
      </div>
      <p className="max-w-xl text-sm leading-6 text-[var(--muted)] md:text-right">{subtitle}</p>
    </header>
  );
}
