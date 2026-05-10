import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Card, PrimaryButton } from "@/components/ui";
import { fallbackWorkouts } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";

type Workout = (typeof fallbackWorkouts)[number];

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: workout } = useResource<Workout>(`/workouts/${id}`, fallbackWorkouts[0]);

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-10 pt-4">
      <Card className="gap-2">
        <Text className="text-3xl font-black text-white">{workout.name}</Text>
        <Text className="text-muted">{workout.description}</Text>
      </Card>

      <View className="gap-3">
        {workout.exercises?.map((item) => (
          <Card key={item.id} className="gap-2">
            <Text className="text-lg font-black text-white">{item.exercise.name}</Text>
            <Text className="text-muted">
              {item.sets} séries x {item.reps} repetições | {item.restSeconds}s de descanso
            </Text>
            <Text className="font-bold text-neon">Meta {item.targetWeight ?? "--"}kg</Text>
          </Card>
        ))}
      </View>

      <Link href={`/workout/start/${workout.id}`} asChild>
        <PrimaryButton label="Iniciar treino" />
      </Link>
    </ScrollView>
  );
}
