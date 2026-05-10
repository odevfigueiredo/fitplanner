import { Link, router } from "expo-router";
import { ScrollView, Text } from "react-native";
import { Card, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useAuth } from "@/context/auth-context";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-10 pt-4">
      <Card className="gap-2">
        <Text className="text-3xl font-black text-white">{user?.name ?? "Atleta"}</Text>
        <Text className="text-muted">{user?.email ?? "Não sincronizado"}</Text>
      </Card>
      <Link href="/settings" asChild>
        <SecondaryButton label="Configurações" />
      </Link>
      <PrimaryButton label="Sair" onPress={handleLogout} />
    </ScrollView>
  );
}
