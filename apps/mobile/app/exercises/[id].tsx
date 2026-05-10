import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text } from "react-native";
import { Card } from "@/components/ui";
import { fallbackExercises } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";

type Exercise = (typeof fallbackExercises)[number];

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: exercise } = useResource<Exercise>(`/exercises/${id}`, fallbackExercises[0]);

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-10 pt-4">
      <Card className="gap-3">
        <Text className="text-3xl font-black text-white">{exercise.name}</Text>
        <Text className="text-base font-bold text-neon">{exercise.muscleGroup}</Text>
        <Text className="text-muted">{exercise.equipment ?? "Sem equipamento"}</Text>
      </Card>
      <Card>
        <Text className="text-base leading-6 text-white">{exercise.instructions ?? "Nenhuma instrução informada."}</Text>
      </Card>
    </ScrollView>
  );
}
