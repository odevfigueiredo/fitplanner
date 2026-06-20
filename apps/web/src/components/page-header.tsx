export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex flex-col justify-between gap-3 border-b border-[var(--line)] pb-4 md:flex-row md:items-end md:gap-6 md:pb-5">
      <div>
        <p className="text-xs font-black uppercase text-[var(--accent)]">FitPlanner</p>
        <h1 className="mt-1 text-2xl font-black leading-tight text-white md:text-4xl">{title}</h1>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-right">{subtitle}</p>
    </header>
  );
}
