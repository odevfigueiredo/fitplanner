import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Card, ExerciseBadge, PrimaryButton, TextField } from "@/components/ui";
import { useAuth } from "@/context/auth-context";
import { fallbackWorkouts } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";
import { apiFetch } from "@/lib/api";
import { cacheWorkoutLog } from "@/lib/local-db";

type Workout = (typeof fallbackWorkouts)[number];

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const { data: workout } = useResource<Workout>(`/workouts/${id}`, fallbackWorkouts[0]);
  const [durationMinutes, setDurationMinutes] = useState("55");
  const [notes, setNotes] = useState("");
  const [weight, setWeight] = useState("80");
  const [effort, setEffort] = useState("8");

  async function finishWorkout() {
    const payload = {
      workoutId: workout.id,
      date: new Date().toISOString(),
      durationMinutes: Number(durationMinutes),
      notes,
      exercises: workout.exercises.map((item) => ({
        exerciseId: item.exercise.id,
        setsCompleted: item.sets,
        repsCompleted: item.sets * item.reps,
        weightUsed: Number(weight),
        perceivedEffort: Number(effort),
      })),
    };

    try {
      await cacheWorkoutLog(workout.id, payload);
      await apiFetch("/workout-logs", { token, method: "POST", body: payload });
      router.replace("/(tabs)/history");
    } catch (error) {
      Alert.alert("Salvo localmente", error instanceof Error ? error.message : "A API estava indisponível. O cache local foi atualizado.");
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">Sessão</Text>
        <Text className="text-3xl font-black text-white">{workout.name}</Text>
        <Text className="mt-1 text-sm text-muted">Registro rápido para terminar sem travar o treino.</Text>
      </View>

      {workout.exercises.map((item, index) => (
        <Card key={item.id} className="gap-3">
          <View className="flex-row items-center gap-3">
            <Text className="h-8 w-8 rounded-full bg-neon pt-1 text-center text-xs font-black text-black">{index + 1}</Text>
            <ExerciseBadge label={item.exercise.name} detail={item.exercise.muscleGroup} />
            <View className="flex-1">
              <Text className="text-lg font-black text-white">{item.exercise.name}</Text>
              <Text className="text-sm text-muted">Meta {item.targetWeight ?? "--"}kg</Text>
            </View>
            <Text className="font-black text-neon">{item.sets}x{item.reps}</Text>
          </View>
        </Card>
      ))}

      <Card className="gap-3">
        <Text className="font-black text-white">Resumo final</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextField label="Duração" value={durationMinutes} onChangeText={setDurationMinutes} keyboardType="numeric" />
          </View>
          <View className="flex-1">
            <TextField label="Esforço" value={effort} onChangeText={setEffort} keyboardType="numeric" />
          </View>
        </View>
        <TextField label="Carga usada" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <TextField label="Observações" value={notes} onChangeText={setNotes} multiline />
      </Card>

      <PrimaryButton label="Finalizar treino" onPress={finishWorkout} />
    </ScrollView>
  );
}
