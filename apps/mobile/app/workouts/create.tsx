import { router } from "expo-router";
import { workoutTypes } from "@fitplanner/shared";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { ExerciseBadge, PrimaryButton, TextField } from "@/components/ui";
import { useAuth } from "@/context/auth-context";
import { fallbackExercises } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";
import { apiFetch } from "@/lib/api";

type Exercise = (typeof fallbackExercises)[number];

export default function CreateWorkoutScreen() {
  const { token } = useAuth();
  const { data: exercises } = useResource<Exercise[]>("/exercises", fallbackExercises);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("Strength");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      return (
        !normalizedQuery ||
        exercise.name.toLowerCase().includes(normalizedQuery) ||
        exercise.muscleGroup.toLowerCase().includes(normalizedQuery) ||
        (exercise.equipment ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [exercises, query]);

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
          type: type.trim() || "Strength",
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
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-5 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">Novo plano</Text>
        <Text className="text-3xl font-black text-white">Criar treino</Text>
        <Text className="mt-1 text-sm text-muted">Nome, tipo e exercícios. O resto você ajusta depois.</Text>
      </View>

      <View className="gap-3">
        <TextField label="Nome" value={name} onChangeText={setName} placeholder="Push pesado" />
        <TextField label="Descrição" value={description} onChangeText={setDescription} placeholder="Peito, ombros e tríceps" />
      </View>

      <View className="gap-3">
        <Text className="font-black text-white">Tipo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {workoutTypes.map((item) => (
            <Pressable
              key={item}
              onPress={() => setType(item)}
              className={`rounded-full px-4 py-2 ${type === item ? "bg-neon" : "bg-panel"}`}
            >
              <Text className={`text-xs font-black ${type === item ? "text-black" : "text-muted"}`}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <TextField label="Categoria personalizada" value={type} onChangeText={setType} placeholder="Push, Upper, Casa..." />
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-black text-white">Exercícios</Text>
          <Text className="font-bold text-muted">{selectedExercises.length} selecionados</Text>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar exercício"
          placeholderTextColor="#66736d"
          className="h-12 rounded-2xl border border-line bg-panel px-4 text-base text-white"
        />
        {filteredExercises.map((exercise) => {
          const selected = selectedIds.includes(exercise.id);
          return (
            <Pressable
              key={exercise.id}
              onPress={() => toggleExercise(exercise.id)}
              className={`rounded-2xl border p-3 ${selected ? "border-neon bg-panel2" : "border-line bg-panel"}`}
            >
              <View className="flex-row items-center gap-3">
                <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
                <View className="flex-1">
                  <Text className="text-base font-black text-white">{exercise.name}</Text>
                  <Text className="text-sm text-muted">{exercise.muscleGroup} · {exercise.equipment ?? "Sem equipamento"}</Text>
                </View>
                <Text className={`text-xs font-black ${selected ? "text-neon" : "text-muted"}`}>
                  {selected ? "OK" : "+"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton label={`Criar treino (${selectedExercises.length})`} onPress={submit} />
    </ScrollView>
  );
}
