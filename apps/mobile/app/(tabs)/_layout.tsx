import { Tabs } from "expo-router";
import { Activity, Dumbbell, History, Home, LineChart, User } from "lucide-react-native";

const active = "#36f58a";
const inactive = "#95a39b";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#080b0a" },
        headerTintColor: "#f8fafc",
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: "#0c100f", borderTopColor: "#26312d" },
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Início", tabBarIcon: ({ color }) => <Home color={color} size={20} /> }} />
      <Tabs.Screen name="workouts" options={{ title: "Treinos", tabBarIcon: ({ color }) => <Dumbbell color={color} size={20} /> }} />
      <Tabs.Screen name="exercises" options={{ title: "Exercícios", tabBarIcon: ({ color }) => <Activity color={color} size={20} /> }} />
      <Tabs.Screen name="history" options={{ title: "Histórico", tabBarIcon: ({ color }) => <History color={color} size={20} /> }} />
      <Tabs.Screen name="progress" options={{ title: "Progresso", tabBarIcon: ({ color }) => <LineChart color={color} size={20} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color }) => <User color={color} size={20} /> }} />
    </Tabs>
  );
}
