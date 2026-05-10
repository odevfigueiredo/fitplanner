import { ScrollView, Text, View } from "react-native";
import { Card } from "@/components/ui";
import { useAuth } from "@/context/auth-context";
import { fallbackUser } from "@/data/mock";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const account = user ?? fallbackUser;

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-10 pt-4">
      <Card className="gap-4">
        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-neon">
            <Text className="text-xl font-black text-black">{account.name.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-black text-white">{account.name}</Text>
            <Text className="text-muted">{account.email}</Text>
          </View>
        </View>
        <View className="rounded-2xl bg-ink p-3">
          <Text className="text-xs font-black uppercase tracking-widest text-muted">Usuário desde</Text>
          <Text className="mt-1 font-bold text-white">{formatDate(account.createdAt)}</Text>
        </View>
        <View className="rounded-2xl bg-ink p-3">
          <Text className="text-xs font-black uppercase tracking-widest text-muted">Status</Text>
          <Text className="mt-1 font-bold text-neon">Conta ativa</Text>
        </View>
        <View className="rounded-2xl bg-ink p-3">
          <Text className="text-xs font-black uppercase tracking-widest text-muted">ID</Text>
          <Text selectable className="mt-1 font-bold text-white">{account.id}</Text>
        </View>
      </Card>
      <Card className="gap-2">
        <Text className="text-lg font-black text-white">API</Text>
        <Text selectable className="text-muted">{process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333"}</Text>
      </Card>
    </ScrollView>
  );
}
