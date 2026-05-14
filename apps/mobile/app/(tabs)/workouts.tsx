import { Link } from "expo-router";
import { workoutTypes } from "@fitplanner/shared";
import { useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Card, EmptyState, PrimaryButton } from "@/components/ui";
import { fallbackWorkouts } from "@/data/mock";
import { getTrainingTypeImage } from "@/lib/assets";
import { useResource } from "@/hooks/use-resource";

type Workout = (typeof fallbackWorkouts)[number];

function uniqueList(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export default function WorkoutsScreen() {
  const { data: workouts } = useResource<Workout[]>("/workouts", fallbackWorkouts);
  const categories = useMemo(
    () => uniqueList([...workoutTypes, ...workouts.map((workout) => workout.type)]),
    [workouts],
  );

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">Planner</Text>
        <Text className="text-3xl font-black text-white">Treinos</Text>
        <Text className="mt-1 text-sm text-muted">Divisoes, categorias e metas de carga prontas para a academia.</Text>
      </View>
      <Link href="/workouts/create" asChild>
        <PrimaryButton label="Criar treino" />
      </Link>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
        {categories.map((type) => (
          <View key={type} className="w-44 overflow-hidden rounded-2xl border border-line bg-panel">
            <Image source={getTrainingTypeImage(type)} className="h-24 w-full" resizeMode="cover" />
            <Text className="p-2 text-xs font-black text-white">{type}</Text>
          </View>
        ))}
      </ScrollView>

      {workouts.length === 0 ? (
        <EmptyState title="Nenhum treino ainda" body="Crie um plano semanal e deixe suas sessões prontas antes de chegar à academia." />
      ) : (
        workouts.map((workout) => (
          <Link key={workout.id} href={`/workouts/${workout.id}`} asChild>
            <Card className="gap-3">
              <View className="gap-3">
                <Image source={getTrainingTypeImage(workout.type)} className="h-36 w-full rounded-2xl" resizeMode="cover" />
                <View className="flex-row items-start gap-3">
                  <View className="flex-1 gap-1">
                    <Text className="text-xs font-black uppercase tracking-widest text-neon">{workout.type}</Text>
                    <Text className="text-xl font-black text-white">{workout.name}</Text>
                    <Text className="text-sm text-muted">{workout.description}</Text>
                  </View>
                  <Text className="rounded-full bg-neon px-3 py-1 text-xs font-black text-black">{workout.exercises?.length ?? 0}</Text>
                </View>
              </View>
            </Card>
          </Link>
        ))
      )}
    </ScrollView>
  );
}
