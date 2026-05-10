type ChartPoint = {
  label: string;
  value: number;
};

type MetricLineChartProps = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
  unit?: string;
  color?: string;
};

function formatValue(value: number, unit?: string) {
  const display = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${display}${unit}` : display;
}

export function MetricLineChart({ title, subtitle, data, unit, color = "#39ff88" }: MetricLineChartProps) {
  const width = 640;
  const height = 260;
  const padding = { top: 28, right: 28, bottom: 46, left: 54 };
  const values = data.map((point) => point.value);
  const minValue = values.length ? Math.min(...values) : 0;
  const maxValue = values.length ? Math.max(...values) : 1;
  const valuePadding = Math.max((maxValue - minValue) * 0.18, 1);
  const domainMin = minValue - valuePadding;
  const domainMax = maxValue + valuePadding;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const points = data.map((point, index) => {
    const x = padding.left + (data.length === 1 ? plotWidth / 2 : (plotWidth * index) / (data.length - 1));
    const y = padding.top + ((domainMax - point.value) / (domainMax - domainMin || 1)) * plotHeight;
    return { ...point, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = points.length
    ? `${padding.left},${height - padding.bottom} ${line} ${width - padding.right},${height - padding.bottom}`
    : "";
  const first = points[0];
  const last = points.at(-1);

  return (
    <div className="min-w-0 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 md:p-5">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
        <div>
          <p className="font-black text-white">{title}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
        {last ? (
          <span className="w-fit rounded-full bg-[rgba(57,255,136,0.12)] px-3 py-1 text-xs font-black text-[var(--neon)]">
            {formatValue(last.value, unit)}
          </span>
        ) : null}
      </div>

      <div className="mt-4 h-[220px] w-full overflow-hidden md:mt-5 md:h-[260px]">
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-[var(--panel-2)] text-sm text-[var(--muted)]">
            Sem dados suficientes para o gráfico.
          </div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label={title}>
            <defs>
              <linearGradient id={`area-${title.replace(/\W/g, "")}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.38" />
                <stop offset="100%" stopColor={color} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((tick) => {
              const y = padding.top + (plotHeight * tick) / 3;
              const value = domainMax - ((domainMax - domainMin) * tick) / 3;
              return (
                <g key={tick}>
                  <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
                  <text x={padding.left - 12} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.46)" fontSize="12">
                    {formatValue(value, unit)}
                  </text>
                </g>
              );
            })}
            {area ? <polygon points={area} fill={`url(#area-${title.replace(/\W/g, "")})`} /> : null}
            <polyline points={line} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point) => (
              <g key={`${point.label}-${point.value}`}>
                <circle cx={point.x} cy={point.y} r="6" fill="#0b0f0d" stroke={color} strokeWidth="3" />
                <title>{`${point.label}: ${formatValue(point.value, unit)}`}</title>
              </g>
            ))}
            {first ? (
              <text x={first.x} y={height - 18} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="12">
                {first.label}
              </text>
            ) : null}
            {last && last !== first ? (
              <text x={last.x} y={height - 18} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="12">
                {last.label}
              </text>
            ) : null}
          </svg>
        )}
      </div>
    </div>
  );
}
