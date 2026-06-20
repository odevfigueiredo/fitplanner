function hashText(value: string) {
  return [...value].reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const accents = ["#fc4c02", "#ff7a1a", "#2f80ed", "#22c55e", "#facc15", "#ef4444"];

export function ExerciseBadge({ label, detail }: { label: string; detail?: string | null }) {
  const accent = accents[hashText(`${label}${detail ?? ""}`) % accents.length];

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel-2)] text-xs font-black text-black">
      <span className="grid h-7 w-7 place-items-center rounded-md" style={{ backgroundColor: accent }}>
        {initials(label)}
      </span>
    </span>
  );
}
