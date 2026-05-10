import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { PrimaryButton, TextField } from "@/components/ui";
import { useAuth } from "@/context/auth-context";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Falha no cadastro", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-ink">
      <ScrollView contentContainerClassName="flex-grow justify-center gap-8 px-6 py-12">
        <View className="gap-3">
          <Image source={require("../../assets/images/fitplanner-mark.png")} className="h-20 w-20 rounded-2xl" />
          <Text className="text-4xl font-black text-white">Criar conta</Text>
          <Text className="text-base leading-6 text-muted">Comece com treinos planejados, histórico e progresso físico sincronizado.</Text>
        </View>
        <View className="gap-4">
          <TextField label="Nome" value={name} onChangeText={setName} />
          <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextField label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
          <PrimaryButton label={isSubmitting ? "Criando..." : "Cadastrar"} onPress={handleSubmit} disabled={isSubmitting} />
        </View>
        <Link href="/(auth)/login" className="text-center text-neon">
          Já tenho uma conta
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
