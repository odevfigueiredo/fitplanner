import { Link } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import type { DashboardSummary } from "@fitplanner/shared";
import { LineChart } from "@/components/line-chart";
import { Card, MetricCard, PrimaryButton } from "@/components/ui";
import { fallbackDashboard } from "@/data/mock";
import { getTrainingTypeImage } from "@/lib/assets";
import { useResource } from "@/hooks/use-resource";

export default function HomeDashboardScreen() {
  const { data: dashboard } = useResource<DashboardSummary>("/dashboard/summary", fallbackDashboard);
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
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-5 px-4 pb-10 pt-4">
      <View className="gap-1">
        <Text className="text-sm font-bold uppercase tracking-widest text-neon">Hoje</Text>
        <Text className="text-3xl font-black text-white">Painel</Text>
      </View>

      <View className="flex-row gap-3">
        <MetricCard label="Este mês" value={`${dashboard.totalWorkoutsThisMonth}`} detail="treinos registrados" />
        <MetricCard label="Sequência" value={`${dashboard.workoutStreak}`} detail="dias de treino" />
      </View>
      <View className="flex-row gap-3">
        <MetricCard label="Peso" value={dashboard.cards.currentWeight ? `${dashboard.cards.currentWeight}kg` : "--"} detail="último registro" />
        <MetricCard label="Esforço" value={dashboard.cards.averageEffort ? `${dashboard.cards.averageEffort}/10` : "--"} detail="RPE médio" />
      </View>

      <LineChart title="Peso corporal" subtitle="Registros de medidas" data={weightData} unit="kg" />
      <LineChart title="Carga no exercício" subtitle={dashboard.exerciseLoadTrend.at(-1)?.exerciseName ?? "Carga usada"} data={loadData} unit="kg" />

      <Card className="gap-3">
        <Text className="text-lg font-black text-white">Último treino</Text>
        <Text className="text-2xl font-black text-neon">{dashboard.lastWorkout?.workoutName ?? "Nenhum treino registrado"}</Text>
        <Text className="text-muted">
          {dashboard.lastWorkout ? `${dashboard.lastWorkout.durationMinutes} minutos` : "Inicie um treino para gerar histórico."}
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-lg font-black text-white">Plano semanal</Text>
        {dashboard.weeklyWorkouts.map((workout) => (
          <View key={workout.id} className="flex-row items-center gap-3 rounded-xl bg-panel2 p-3">
            <Image source={getTrainingTypeImage(workout.type)} className="h-12 w-20 rounded-xl" resizeMode="cover" />
            <View className="flex-1">
              <Text className="font-bold text-white">{workout.name}</Text>
              <Text className="text-xs text-neon">{workout.type}</Text>
            </View>
            <Text className="font-black text-neon">{workout.dayOfWeek ?? "-"}</Text>
          </View>
        ))}
      </Card>

      <Link href="/workouts/create" asChild>
        <PrimaryButton label="Planejar novo treino" />
      </Link>
    </ScrollView>
  );
}
