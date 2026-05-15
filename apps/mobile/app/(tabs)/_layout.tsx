import { Tabs } from "expo-router";
import { Activity, Dumbbell, History, Home, LineChart, User } from "lucide-react-native";
import { Platform } from "react-native";

const active = "#36f58a";
const inactive = "#95a39b";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 2,
          paddingVertical: 6,
        },
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: Platform.OS === "ios" ? 22 : 12,
          height: 68,
          borderTopWidth: 1,
          borderTopColor: "#26312d",
          borderRadius: 24,
          backgroundColor: "#101614",
          paddingHorizontal: 8,
          paddingBottom: Platform.OS === "ios" ? 10 : 8,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 18,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Hoje", tabBarIcon: ({ color, focused }) => <Home color={color} fill={focused ? color : "transparent"} size={22} /> }} />
      <Tabs.Screen name="workouts" options={{ title: "Treinos", tabBarIcon: ({ color }) => <Dumbbell color={color} size={22} /> }} />
      <Tabs.Screen name="exercises" options={{ title: "Exercícios", tabBarIcon: ({ color }) => <Activity color={color} size={22} /> }} />
      <Tabs.Screen name="progress" options={{ title: "Progresso", tabBarIcon: ({ color }) => <LineChart color={color} size={22} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: ({ color }) => <User color={color} size={22} /> }} />
      <Tabs.Screen name="history" options={{ title: "Histórico", href: null, tabBarIcon: ({ color }) => <History color={color} size={22} /> }} />
    </Tabs>
  );
}
