import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { PrimaryButton, TextField } from "@/components/ui";
import { useAuth } from "@/context/auth-context";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("teste@fitplanner.app");
  const [password, setPassword] = useState("123456");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Falha ao entrar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-ink">
      <ScrollView contentContainerClassName="flex-grow justify-center gap-8 px-6 py-12">
        <View className="gap-3">
          <Image source={require("../../assets/images/fitplanner-mark.png")} className="h-20 w-20 rounded-2xl" />
          <Text className="text-5xl font-black text-white">FitPlanner</Text>
          <Text className="text-base leading-6 text-muted">
            Planeje treinos, registre cargas e acompanhe evolução física em um fluxo rápido de academia.
          </Text>
        </View>
        <View className="gap-4">
          <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextField label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
          <PrimaryButton label={isSubmitting ? "Entrando..." : "Entrar"} onPress={handleSubmit} disabled={isSubmitting} />
        </View>
        <Link href="/(auth)/register" className="text-center text-neon">
          Criar uma nova conta
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
