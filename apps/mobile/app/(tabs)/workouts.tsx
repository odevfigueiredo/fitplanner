import { Link } from "expo-router";
import { workoutTypes } from "@fitplanner/shared";
import { useMemo, useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const categories = useMemo(
    () => uniqueList(["Todos", ...workoutTypes, ...workouts.map((workout) => workout.type)]),
    [workouts],
  );
  const filteredWorkouts = useMemo(
    () => workouts.filter((workout) => selectedCategory === "Todos" || workout.type === selectedCategory),
    [selectedCategory, workouts],
  );

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">Planner</Text>
        <Text className="text-3xl font-black text-white">Treinos</Text>
        <Text className="mt-1 text-sm text-muted">Crie, filtre e comece sem distração.</Text>
      </View>
      <Link href="/workouts/create" asChild>
        <PrimaryButton label="Criar treino" />
      </Link>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {categories.map((type) => (
          <Text
            key={type}
            onPress={() => setSelectedCategory(type)}
            className={`rounded-full px-4 py-2 text-xs font-black ${selectedCategory === type ? "bg-neon text-black" : "bg-panel text-muted"}`}
          >
            {type}
          </Text>
        ))}
      </ScrollView>

      <View className="flex-row justify-between">
        <Text className="font-black text-white">Planos</Text>
        <Text className="font-bold text-muted">{filteredWorkouts.length} itens</Text>
      </View>

      {filteredWorkouts.length === 0 ? (
        <EmptyState title="Nenhum treino ainda" body="Crie um plano semanal e deixe suas sessões prontas antes de chegar à academia." />
      ) : (
        filteredWorkouts.map((workout) => (
          <Link key={workout.id} href={`/workouts/${workout.id}`} asChild>
            <Card className="gap-3 p-0">
              <Image source={getTrainingTypeImage(workout.type)} className="h-32 w-full rounded-t-2xl" resizeMode="cover" />
              <View className="gap-2 p-4 pt-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-black uppercase tracking-widest text-neon">{workout.type}</Text>
                  <Text className="rounded-full bg-neon px-3 py-1 text-xs font-black text-black">{workout.exercises?.length ?? 0}</Text>
                </View>
                <Text className="text-xl font-black text-white">{workout.name}</Text>
                <Text className="text-sm leading-5 text-muted">{workout.description}</Text>
              </View>
            </Card>
          </Link>
        ))
      )}
    </ScrollView>
  );
}
