import { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  TextInput,
  TextInputProps,
  View
} from "react-native";

const badgeAccents = ["#36f58a", "#8cffd2", "#d6ff65", "#74a7ff", "#f6d365", "#ff8f70"];

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

export function Screen({ children }: PropsWithChildren) {
  return <View className="flex-1 bg-ink px-4 py-5">{children}</View>;
}

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <View className={`rounded-2xl border border-line bg-panel p-4 ${className}`}>{children}</View>;
}

export function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <Card className="min-h-28 flex-1 justify-between">
      <Text className="text-xs uppercase tracking-widest text-muted">{label}</Text>
      <Text className="text-3xl font-black text-white">{value}</Text>
      {detail ? <Text className="text-sm text-muted">{detail}</Text> : null}
    </Card>
  );
}

export function ExerciseBadge({ label, detail }: { label: string; detail?: string | null }) {
  const accent = badgeAccents[hashText(`${label}${detail ?? ""}`) % badgeAccents.length];

  return (
    <View className="h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-panel2">
      <View className="h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: accent }}>
        <Text className="text-xs font-black text-black">{initials(label)}</Text>
      </View>
    </View>
  );
}

export function PrimaryButton({ label, className = "", disabled, ...props }: PressableProps & { label: string; className?: string }) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      className={`min-h-14 items-center justify-center rounded-2xl bg-neon px-5 ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <Text className="text-base font-black text-black">{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, className = "", ...props }: PressableProps & { label: string; className?: string }) {
  return (
    <Pressable {...props} className={`min-h-12 items-center justify-center rounded-2xl border border-line px-5 ${className}`}>
      <Text className="font-bold text-white">{label}</Text>
    </Pressable>
  );
}

export function TextField({ label, className = "", ...props }: TextInputProps & { label: string; className?: string }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-bold text-muted">{label}</Text>
      <TextInput
        placeholderTextColor="#66736d"
        className={`min-h-14 rounded-2xl border border-line bg-panel px-4 text-base text-white ${className}`}
        {...props}
      />
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="items-center gap-2 py-8">
      <Text className="text-xl font-black text-white">{title}</Text>
      <Text className="text-center text-sm leading-5 text-muted">{body}</Text>
    </Card>
  );
}

export function LoadingState({ label = "Carregando" }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-ink">
      <ActivityIndicator color="#36f58a" />
      <Text className="font-bold text-muted">{label}</Text>
    </View>
  );
}
