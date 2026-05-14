import { Link } from "expo-router";
import { CalendarDays, ChevronRight, Flame, Sparkles } from "lucide-react-native";
import { Image, ScrollView, Text, View } from "react-native";
import type { DashboardSummary } from "@fitplanner/shared";
import { LineChart } from "@/components/line-chart";
import { Card, MetricCard, PrimaryButton, SecondaryButton } from "@/components/ui";
import { fallbackDashboard } from "@/data/mock";
import { getTrainingTypeImage } from "@/lib/assets";
import { useResource } from "@/hooks/use-resource";

const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const scienceCoachImage = require("../../assets/images/science-coach.png");

export default function HomeDashboardScreen() {
  const { data: dashboard } = useResource<DashboardSummary>("/dashboard/summary", fallbackDashboard);
  const nextWorkout = dashboard.weeklyWorkouts[0];
  const weightData = dashboard.bodyWeightTrend.map((item) => ({
    label: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    value: item.weight,
  }));
  const loadData = dashboard.exerciseLoadTrend
    .filter((item) => item.weightUsed !== null)
    .slice(-6)
    .map((item) => ({
      label: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: item.weightUsed ?? 0,
    }));

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-5 px-4 pb-28 pt-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-black uppercase tracking-widest text-neon">FitPlanner</Text>
          <Text className="text-3xl font-black text-white">Hoje</Text>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-panel">
          <Flame color="#36f58a" size={22} />
        </View>
      </View>

      <Card className="overflow-hidden p-0">
        <Image source={getTrainingTypeImage(nextWorkout?.type ?? "Strength")} className="h-36 w-full" resizeMode="cover" />
        <View className="gap-3 p-4">
          <View className="flex-row items-center gap-2">
            <CalendarDays color="#36f58a" size={18} />
            <Text className="text-xs font-black uppercase tracking-widest text-neon">
              {typeof nextWorkout?.dayOfWeek === "number" ? dayLabels[nextWorkout.dayOfWeek] : "Plano livre"}
            </Text>
          </View>
          <Text className="text-2xl font-black text-white">{nextWorkout?.name ?? "Monte seu proximo treino"}</Text>
          <Text className="text-sm leading-5 text-muted">
            {nextWorkout ? `${nextWorkout.exerciseCount} exercicios no plano. Ajuste carga, descanso e reps antes de iniciar.` : "Crie uma divisao de treino personalizada."}
          </Text>
          <View className="flex-row gap-3">
            <Link href="/workouts" asChild>
              <PrimaryButton label="Comecar" className="flex-1" />
            </Link>
            <Link href="/history" asChild>
              <SecondaryButton label="Historico" className="flex-1" />
            </Link>
          </View>
        </View>
      </Card>

      <View className="flex-row gap-3">
        <MetricCard label="Mes" value={`${dashboard.totalWorkoutsThisMonth}`} detail="treinos" />
        <MetricCard label="Streak" value={`${dashboard.workoutStreak}`} detail="dias" />
      </View>
      <View className="flex-row gap-3">
        <MetricCard label="Peso" value={dashboard.cards.currentWeight ? `${dashboard.cards.currentWeight}kg` : "--"} detail="ultimo" />
        <MetricCard label="RPE" value={dashboard.cards.averageEffort ? `${dashboard.cards.averageEffort}/10` : "--"} detail="medio" />
      </View>

      <Card className="gap-3">
        <Image source={scienceCoachImage} className="h-32 w-full rounded-2xl" resizeMode="cover" />
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Sparkles color="#36f58a" size={18} />
            <Text className="text-lg font-black text-white">Coach cientifico</Text>
          </View>
          <ChevronRight color="#95a39b" size={18} />
        </View>
        {dashboard.science.recommendations.slice(0, 3).map((item) => (
          <View key={item.id} className="rounded-2xl bg-panel2 p-3">
            <Text className="font-black text-white">{item.title}</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">{item.summary}</Text>
          </View>
        ))}
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-black text-white">Volume semanal</Text>
        {dashboard.science.weeklyMuscleSets.slice(0, 5).map((item) => {
          const width = `${Math.min(100, Math.max(10, (item.sets / 20) * 100))}%` as `${number}%`;
          return (
            <View key={item.muscleGroup} className="gap-2">
              <View className="flex-row justify-between">
                <Text className="font-bold text-white">{item.muscleGroup}</Text>
                <Text className="font-black text-neon">{item.sets} series</Text>
              </View>
              <View className="h-2 overflow-hidden rounded-full bg-black/30">
                <View className="h-full rounded-full bg-neon" style={{ width }} />
              </View>
            </View>
          );
        })}
      </Card>

      <LineChart title="Peso corporal" subtitle="Registros de medidas" data={weightData} unit="kg" />
      <LineChart title="Carga no exercicio" subtitle={dashboard.exerciseLoadTrend.at(-1)?.exerciseName ?? "Carga usada"} data={loadData} unit="kg" />
    </ScrollView>
  );
}
