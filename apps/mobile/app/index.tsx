import { Redirect } from "expo-router";
import { LoadingState } from "@/components/ui";
import { useAuth } from "@/context/auth-context";

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState label="Carregando FitPlanner" />;
  }

  return <Redirect href={token ? "/(tabs)" : "/(auth)/login"} />;
}
