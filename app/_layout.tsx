import { Stack } from 'expo-router';

export type RootStackParamList = {
  resultScreen: { watts: number; valor: string }; // Recebe os dados da IA
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen 
        name="resultScreen" 
        options={{ 
          presentation: 'modal',
          headerTitle: 'Leitura Concluída' 
        }} 
      />
    </Stack>
  );
}