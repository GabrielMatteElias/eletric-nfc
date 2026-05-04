import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones padrão do Expo
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#225d81', // Cor do ícone quando ativo
        tabBarInactiveTintColor: '#C4C7C5', // Cor do ícone quando inativo
        tabBarStyle: {
          backgroundColor: '#1C1B1F', // Fundo Material Dark
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,

        // A MÁGICA DA CÁPSULA ACONTECE AQUI:
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarIcon: ({ focused, color, size }) => (
          <View style={[
            styles.iconContainer,
            focused && styles.activeCapsule // Aplica a cápsula apenas se estiver focado
          ]}>
            <Ionicons name="home" size={22} color={focused ? '#E3E3E3' : '#C4C7C5'} />
          </View>
        ),
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeCapsule]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={focused ? "#FFFFFF" : "#C4C7C5"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: '', // Remove o texto para focar no ícone
          tabBarIcon: () => (
            <View style={styles.centralButton}>
              <Ionicons name="flash" size={30} color="#fff" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeCapsule]}>
              <Ionicons
                name={focused ? "list" : "list-outline"}
                size={22}
                color={focused ? "#FFFFFF" : "#C4C7C5"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Estilo das Cápsulas (Padrão Google Play / Gmail)
  iconContainer: {
    width: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeCapsule: {
    backgroundColor: '#004A77', // Azul profundo discreto para o modo dark
  },
  
  // Estilo do Botão Central "Saltado"
  centralButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#0057ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40, // Faz ele "saltar" para fora da barra
    elevation: 8,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    borderWidth: 4,
    borderColor: '#1C1B1F', // Borda da mesma cor da tab bar para o efeito "cut-out"
  },
});