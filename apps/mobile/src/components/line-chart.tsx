import { Text, View } from "react-native";
import Svg, { Circle, Defs, G, Line, LinearGradient, Polygon, Polyline, Stop, Text as SvgText } from "react-native-svg";
import { Card } from "@/components/ui";

type ChartPoint = {
  label: string;
  value: number;
};

type LineChartProps = {
  title: string;
  subtitle: string;
  data: ChartPoint[];
  unit?: string;
};

function formatValue(value: number, unit?: string) {
  const display = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return unit ? `${display}${unit}` : display;
}

export function LineChart({ title, subtitle, data, unit }: LineChartProps) {
  const width = 360;
  const height = 220;
  const padding = { top: 22, right: 18, bottom: 38, left: 46 };
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
  const area = points.length ? `${padding.left},${height - padding.bottom} ${line} ${width - padding.right},${height - padding.bottom}` : "";
  const last = points.at(-1);

  return (
    <Card className="gap-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-black text-white">{title}</Text>
          <Text className="text-xs text-muted">{subtitle}</Text>
        </View>
        {last ? <Text className="rounded-full bg-neon/10 px-3 py-1 text-xs font-black text-neon">{formatValue(last.value, unit)}</Text> : null}
      </View>
      {points.length === 0 ? (
        <View className="h-52 items-center justify-center rounded-xl bg-panel2">
          <Text className="text-sm text-muted">Sem dados suficientes.</Text>
        </View>
      ) : (
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="mobileChartArea" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0%" stopColor="#39ff88" stopOpacity="0.38" />
              <Stop offset="100%" stopColor="#39ff88" stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
          {[0, 1, 2].map((tick) => {
            const y = padding.top + (plotHeight * tick) / 2;
            const value = domainMax - ((domainMax - domainMin) * tick) / 2;
            return (
              <G key={tick}>
                <Line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
                <SvgText x={padding.left - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.48)" fontSize="10">
                  {formatValue(value, unit)}
                </SvgText>
              </G>
            );
          })}
          <Polygon points={area} fill="url(#mobileChartArea)" />
          <Polyline points={line} fill="none" stroke="#39ff88" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point) => (
            <Circle key={`${point.label}-${point.value}`} cx={point.x} cy={point.y} r="5" fill="#0b0f0d" stroke="#39ff88" strokeWidth="3" />
          ))}
          {points[0] ? (
            <SvgText x={points[0].x} y={height - 16} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="10">
              {points[0].label}
            </SvgText>
          ) : null}
          {last && last !== points[0] ? (
            <SvgText x={last.x} y={height - 16} textAnchor="middle" fill="rgba(255,255,255,0.58)" fontSize="10">
              {last.label}
            </SvgText>
          ) : null}
        </Svg>
      )}
    </Card>
  );
}
