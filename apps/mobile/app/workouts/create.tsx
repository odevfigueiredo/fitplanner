import { router } from "expo-router";
import { workoutTypes } from "@fitplanner/shared";
import { useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton, TextField } from "@/components/ui";
import { useAuth } from "@/context/auth-context";
import { fallbackExercises } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";
import { apiFetch } from "@/lib/api";
import { getTrainingTypeImage } from "@/lib/assets";

type Exercise = (typeof fallbackExercises)[number];

export default function CreateWorkoutScreen() {
  const { token } = useAuth();
  const { data: exercises } = useResource<Exercise[]>("/exercises", fallbackExercises);
  const [name, setName] = useState("");
  const [type, setType] = useState<(typeof workoutTypes)[number]>("Strength");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedExercises = useMemo(
    () => exercises.filter((exercise) => selectedIds.includes(exercise.id)),
    [exercises, selectedIds],
  );

  function toggleExercise(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function submit() {
    if (!name.trim() || selectedExercises.length === 0) {
      Alert.alert("Dados incompletos", "Adicione um nome e pelo menos um exercício.");
      return;
    }

    try {
      await apiFetch("/workouts", {
        token,
        method: "POST",
        body: {
          name,
          type,
          description,
          exercises: selectedExercises.map((exercise, order) => ({
            exerciseId: exercise.id,
            sets: 4,
            reps: 8,
            restSeconds: 120,
            targetWeight: null,
            order,
          })),
        },
      });
      router.replace("/(tabs)/workouts");
    } catch (error) {
      Alert.alert("Não foi possível criar o treino", error instanceof Error ? error.message : "Tente novamente.");
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-5 px-4 pb-10 pt-4">
      <TextField label="Nome do treino" value={name} onChangeText={setName} placeholder="Força de empurrar" />
      <TextField label="Descrição" value={description} onChangeText={setDescription} placeholder="Peito, ombros e tríceps" />

      <View className="gap-3">
        <Text className="text-lg font-black text-white">Tipo de treino</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
          {workoutTypes.map((item) => {
            const selected = type === item;
            return (
              <Pressable key={item} onPress={() => setType(item)} className={`w-44 overflow-hidden rounded-2xl border ${selected ? "border-neon bg-panel2" : "border-line bg-panel"}`}>
                <Image source={getTrainingTypeImage(item)} className="h-24 w-full" resizeMode="cover" />
                <Text className="p-2 text-xs font-black text-white">{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="gap-3">
        <Text className="text-lg font-black text-white">Exercícios</Text>
        {exercises.map((exercise) => {
          const selected = selectedIds.includes(exercise.id);
          return (
            <Pressable
              key={exercise.id}
              onPress={() => toggleExercise(exercise.id)}
              className={`rounded-2xl border p-4 ${selected ? "border-neon bg-panel2" : "border-line bg-panel"}`}
            >
              <Text className="text-base font-black text-white">{exercise.name}</Text>
              <Text className="text-sm text-muted">{exercise.muscleGroup} | {exercise.equipment ?? "Sem equipamento"}</Text>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label={`Criar com ${selectedExercises.length} exercícios`} onPress={submit} />
    </ScrollView>
  );
}
