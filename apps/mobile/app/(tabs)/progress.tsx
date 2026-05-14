import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Card, EmptyState, PrimaryButton, TextField } from "@/components/ui";
import { useAuth } from "@/context/auth-context";
import { useResource } from "@/hooks/use-resource";
import { apiFetch } from "@/lib/api";

type BodyProgress = {
  id: string;
  weight: number;
  height?: number | null;
  bodyFat?: number | null;
  chest?: number | null;
  waist?: number | null;
  date: string;
};

export default function BodyProgressScreen() {
  const { token } = useAuth();
  const { data, reload } = useResource<BodyProgress[]>("/body-progress", []);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");

  async function submit() {
    try {
      await apiFetch("/body-progress", {
        token,
        method: "POST",
        body: {
          weight: Number(weight),
          waist: waist ? Number(waist) : null,
          date: new Date().toISOString()
        }
      });
      setWeight("");
      setWaist("");
      await reload();
    } catch (error) {
      Alert.alert("Não foi possível salvar o progresso", error instanceof Error ? error.message : "Tente novamente.");
    }
  }

  return (
    <ScrollView className="flex-1 bg-ink" contentContainerClassName="gap-4 px-4 pb-28 pt-5">
      <Card className="gap-3">
        <Text className="text-xl font-black text-white">Novo registro corporal</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextField label="Peso kg" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          </View>
          <View className="flex-1">
            <TextField label="Cintura cm" value={waist} onChangeText={setWaist} keyboardType="numeric" />
          </View>
        </View>
        <PrimaryButton label="Salvar progresso" onPress={submit} />
      </Card>

      {data.length === 0 ? (
        <EmptyState title="Nenhum registro corporal" body="Acompanhe peso e medidas para visualizar cards e tendências de progresso." />
      ) : (
        data.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-black text-white">{item.weight}kg</Text>
              <Text className="text-muted">{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text className="font-black text-neon">{item.waist ? `${item.waist}cm de cintura` : "Registro corporal"}</Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
