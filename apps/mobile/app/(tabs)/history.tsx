import { ScrollView, Text } from "react-native";
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
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-3 px-4 pb-28 pt-5">
      {logs.length === 0 ? (
        <EmptyState title="Nenhum histórico ainda" body="Treinos concluídos aparecerão aqui com duração, cargas e esforço." />
      ) : (
        logs.map((log) => (
          <Card key={log.id} className="gap-2">
            <Text className="text-xl font-black text-white">{log.workout.name}</Text>
            <Text className="text-muted">{new Date(log.date).toLocaleDateString()} | {log.durationMinutes} minutos</Text>
            <Text className="text-neon">{log.exercises.length} registros de exercício</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
