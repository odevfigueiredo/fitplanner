import { Link } from "expo-router";
import { muscleGroups } from "@fitplanner/shared";
import { Image, ScrollView, Text, View } from "react-native";
import { Card } from "@/components/ui";
import { fallbackExercises } from "@/data/mock";
import { getMuscleImage } from "@/lib/assets";
import { useResource } from "@/hooks/use-resource";

type Exercise = (typeof fallbackExercises)[number];

export default function ExercisesScreen() {
  const { data: exercises } = useResource<Exercise[]>("/exercises", fallbackExercises);

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-3 px-4 pb-10 pt-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
        {muscleGroups.map((group) => (
          <View key={group} className="w-28 overflow-hidden rounded-2xl border border-line bg-panel">
            <Image source={getMuscleImage(group)} className="h-24 w-full bg-ink" resizeMode="contain" />
            <Text className="p-2 text-xs font-black text-white">{group}</Text>
          </View>
        ))}
      </ScrollView>

      {exercises.map((exercise) => (
        <Link key={exercise.id} href={`/exercises/${exercise.id}`} asChild>
          <Card className="gap-2">
            <View className="flex-row items-center gap-3">
              <Image source={getMuscleImage(exercise.muscleGroup)} className="h-16 w-16 rounded-2xl bg-ink" resizeMode="contain" />
              <View className="flex-1">
                <Text className="text-xl font-black text-white">{exercise.name}</Text>
                <Text className="text-sm text-muted">{exercise.muscleGroup} | {exercise.equipment ?? "Sem equipamento"}</Text>
                <Text className="text-sm text-neon">{exercise.userId ? "Personalizado" : "Global"}</Text>
              </View>
            </View>
          </Card>
        </Link>
      ))}
    </ScrollView>
  );
}
