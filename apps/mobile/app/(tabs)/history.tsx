import { ScrollView, Text, View } from "react-native";
import { Card, EmptyState } from "@/components/ui";
import { useResource } from "@/hooks/use-resource";

type WorkoutLog = {
  id: string;
  date: string;
  durationMinutes: number;
  notes?: string | null;
  workout: { name: string };
  exercises: Array<{ id: string; exercise: { name: string }; weightUsed?: number | null }>;
};

export default function WorkoutHistoryScreen() {
  const { data: logs } = useResource<WorkoutLog[]>("/workout-logs", []);

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <View>
        <Text className="text-xs font-black uppercase tracking-widest text-neon">Registro</Text>
        <Text className="text-3xl font-black text-white">Histórico</Text>
      </View>

      {logs.length === 0 ? (
        <EmptyState title="Nada registrado" body="Treinos concluídos aparecerão aqui com duração, cargas e esforço." />
      ) : (
        logs.map((log) => (
          <Card key={log.id} className="gap-2">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-xl font-black text-white">{log.workout.name}</Text>
                <Text className="text-sm text-muted">{new Date(log.date).toLocaleDateString("pt-BR")} · {log.durationMinutes} min</Text>
              </View>
              <Text className="rounded-full bg-neon px-3 py-1 text-xs font-black text-black">{log.exercises.length}</Text>
            </View>
            {log.notes ? <Text className="text-sm text-muted">{log.notes}</Text> : null}
          </Card>
        ))
      )}
    </ScrollView>
  );
}
