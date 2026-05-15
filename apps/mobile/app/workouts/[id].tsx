import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Card, ExerciseBadge, PrimaryButton } from "@/components/ui";
import { fallbackWorkouts } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";

type Workout = (typeof fallbackWorkouts)[number];

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: workout } = useResource<Workout>(`/workouts/${id}`, fallbackWorkouts[0]);

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">{workout.type}</Text>
        <Text className="text-3xl font-black text-white">{workout.name}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted">{workout.description}</Text>
      </View>

      <View className="flex-row gap-3">
        <Card className="flex-1 gap-1">
          <Text className="text-xs font-black uppercase tracking-widest text-muted">Exercícios</Text>
          <Text className="text-3xl font-black text-white">{workout.exercises?.length ?? 0}</Text>
        </Card>
        <Card className="flex-1 gap-1">
          <Text className="text-xs font-black uppercase tracking-widest text-muted">Descanso</Text>
          <Text className="text-3xl font-black text-white">{workout.exercises?.[0]?.restSeconds ?? 0}s</Text>
        </Card>
      </View>

      <View className="gap-3">
        <Text className="font-black text-white">Sequência</Text>
        {workout.exercises?.map((item, index) => (
          <Card key={item.id} className="gap-3">
            <View className="flex-row items-center gap-3">
              <Text className="h-8 w-8 rounded-full bg-neon pt-1 text-center text-xs font-black text-black">{index + 1}</Text>
              <ExerciseBadge label={item.exercise.name} detail={item.exercise.muscleGroup} />
              <View className="flex-1">
                <Text className="text-lg font-black text-white">{item.exercise.name}</Text>
                <Text className="text-sm text-muted">{item.exercise.muscleGroup}</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-muted">
              {item.sets} séries · {item.reps} reps · {item.restSeconds}s · meta {item.targetWeight ?? "--"}kg
            </Text>
          </Card>
        ))}
      </View>

      <Link href={`/workout/start/${workout.id}`} asChild>
        <PrimaryButton label="Iniciar treino" />
      </Link>
    </ScrollView>
  );
}
