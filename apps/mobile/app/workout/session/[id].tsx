import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Card, PrimaryButton, TextField } from "@/components/ui";
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
        perceivedEffort: Number(effort)
      }))
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
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-10 pt-4">
      <Card className="gap-2">
        <Text className="text-2xl font-black text-white">{workout.name}</Text>
        <Text className="text-muted">Modo de registro rápido</Text>
      </Card>

      {workout.exercises.map((item) => (
        <Card key={item.id} className="gap-2">
          <View className="flex-row justify-between gap-4">
            <Text className="flex-1 text-lg font-black text-white">{item.exercise.name}</Text>
            <Text className="font-black text-neon">{item.sets} x {item.reps}</Text>
          </View>
          <Text className="text-muted">Carga alvo {item.targetWeight ?? "--"}kg</Text>
        </Card>
      ))}

      <View className="flex-row gap-3">
        <View className="flex-1">
          <TextField label="Duração" value={durationMinutes} onChangeText={setDurationMinutes} keyboardType="numeric" />
        </View>
        <View className="flex-1">
          <TextField label="Esforço 1-10" value={effort} onChangeText={setEffort} keyboardType="numeric" />
        </View>
      </View>
      <TextField label="Carga usada" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <TextField label="Observações" value={notes} onChangeText={setNotes} multiline />
      <PrimaryButton label="Finalizar e salvar treino" onPress={finishWorkout} />
    </ScrollView>
  );
}
