import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar'; // Use o componente do Expo

const { width } = Dimensions.get('window');

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [isScanning, setIsScanning] = useState(false);

  // Referência para a animação
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      // Inicia o loop apenas se estiver escaneando
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Para e reseta a animação se não estiver escaneando
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [isScanning]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.2],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <View style={styles.container}>
      {/* 'light' faz os ícones do celular ficarem BRANCOS.
        'dark' faz os ícones do celular ficarem PRETOS.
      */}
      <StatusBar style="light" translucent />

      {/* Background Escuro e Conteúdo */}
      <View style={[styles.background, { paddingTop: insets.top + 40 }]}>

        <View style={styles.header}>
          <Text style={styles.mainInstruction}>
            {isScanning ? 'AGUARDANDO' : 'PRONTO PARA INICIAR'}
          </Text>
          <Text style={styles.subInstruction}>
            {isScanning
              ? 'Mantenha o celular próximo ao relógio de energia'
              : 'Toque no botão abaixo para ativar o sensor NFC'}
          </Text>
        </View>

        <View style={styles.centerArea}>
          {/* Círculos de Pulso (Só visíveis quando isScanning é true) */}
          {isScanning && (
            <>
              <Animated.View style={[styles.pulse, { transform: [{ scale }], opacity }]} />
              <Animated.View style={[styles.pulse, { transform: [{ scale }], opacity }]} />
            </>
          )}

          <View style={[styles.iconCircle, isScanning && styles.iconCircleActive]}>
            <Ionicons
              name={"radio"}
              size={60}
              color={isScanning ? "#fff" : "#0057ff"}
            />
          </View>
        </View>

        {/* Botão posicionado mais ao meio/inferior, mas sem colar nas tabs */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 100 }]}>
          <TouchableOpacity
            style={[styles.button, isScanning && styles.buttonActive]}
            activeOpacity={0.8}
            onPress={() => setIsScanning(!isScanning)}
          >
            <Text style={[styles.buttonText, isScanning && styles.buttonTextActive]}>
              {isScanning ? 'CANCELAR LEITURA' : 'INICIAR LEITURA NFC'}
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814', // Fundo quase preto (estilo Dark Mode Premium)
  },
  background: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 14,
    letterSpacing: 2,
    color: '#0057ff',
    fontWeight: 'bold',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  mainInstruction: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subInstruction: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  centerArea: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconCircleActive: {
    backgroundColor: '#0057ff',
  },
  pulse: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#0057ff',
    zIndex: 1,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#fff',
    width: width * 0.8,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonTextActive: {
    color: '#fff',
  }
});