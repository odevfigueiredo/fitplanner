import { Link } from "expo-router";
import { muscleGroups } from "@fitplanner/shared";
import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { Card, ExerciseBadge } from "@/components/ui";
import { fallbackExercises } from "@/data/mock";
import { useResource } from "@/hooks/use-resource";

type Exercise = (typeof fallbackExercises)[number];

export default function ExercisesScreen() {
  const { data: exercises } = useResource<Exercise[]>("/exercises", fallbackExercises);
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [query, setQuery] = useState("");

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesGroup = selectedGroup === "Todos" || exercise.muscleGroup === selectedGroup;
      const matchesQuery =
        !normalizedQuery ||
        exercise.name.toLowerCase().includes(normalizedQuery) ||
        exercise.muscleGroup.toLowerCase().includes(normalizedQuery) ||
        (exercise.equipment ?? "").toLowerCase().includes(normalizedQuery);

      return matchesGroup && matchesQuery;
    });
  }, [exercises, query, selectedGroup]);

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">Biblioteca</Text>
        <Text className="text-3xl font-black text-white">Exercícios</Text>
        <Text className="mt-1 text-sm text-muted">Filtre rápido e escolha o movimento certo.</Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar exercício"
        placeholderTextColor="#66736d"
        className="h-12 rounded-2xl border border-line bg-panel px-4 text-base text-white"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
        {["Todos", ...muscleGroups].map((group) => (
          <Text
            key={group}
            onPress={() => setSelectedGroup(group)}
            className={`rounded-full px-4 py-2 text-xs font-black ${selectedGroup === group ? "bg-neon text-black" : "bg-panel text-muted"}`}
          >
            {group}
          </Text>
        ))}
      </ScrollView>

      <View className="flex-row justify-between">
        <Text className="font-black text-white">Lista</Text>
        <Text className="font-bold text-muted">{filteredExercises.length} itens</Text>
      </View>

      {filteredExercises.map((exercise) => (
        <Link key={exercise.id} href={`/exercises/${exercise.id}`} asChild>
          <Card className="gap-2">
            <View className="flex-row items-center gap-3">
              <ExerciseBadge label={exercise.name} detail={exercise.muscleGroup} />
              <View className="flex-1">
                <Text className="text-lg font-black text-white">{exercise.name}</Text>
                <Text className="text-sm text-muted">{exercise.muscleGroup} · {exercise.equipment ?? "Sem equipamento"}</Text>
              </View>
              <Text className="text-xs font-black text-neon">{exercise.userId ? "Custom" : "Global"}</Text>
            </View>
          </Card>
        </Link>
      ))}
    </ScrollView>
  );
}
