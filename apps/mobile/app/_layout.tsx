import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#080b0a" },
          headerTintColor: "#f8fafc",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#080b0a" }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="workouts/create" options={{ title: "Criar treino" }} />
        <Stack.Screen name="workouts/[id]" options={{ title: "Detalhes do treino" }} />
        <Stack.Screen name="exercises/[id]" options={{ title: "Detalhes do exercício" }} />
        <Stack.Screen name="workout/start/[id]" options={{ title: "Iniciar treino" }} />
        <Stack.Screen name="workout/session/[id]" options={{ title: "Sessão de treino" }} />
        <Stack.Screen name="settings" options={{ title: "Configurações" }} />
      </Stack>
    </AuthProvider>
  );
}
