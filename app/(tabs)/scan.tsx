import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  View,
  Text,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native"; // Import necessário para navegar
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../_layout";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: any;
    if (isScanning) {
      startScanAnimation();

      timer = setTimeout(() => {
        handleIAFinish();
      }, 4000);
    } else {
      scanLineAnim.stopAnimation();
      scanLineAnim.setValue(0);
    }
    return () => clearTimeout(timer);
  }, [isScanning]);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 200,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handleIAFinish = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const wattsSimulados = 450;
    const valorKwh = 0.92;
    const totalFatura = (wattsSimulados * valorKwh).toFixed(2);

    setIsScanning(false);

    // Navegação corrigida passando os parâmetros para a próxima tela
    navigation.navigate("resultScreen", {
      watts: wattsSimulados,
      valor: totalFatura,
    });
  };

  if (!permission?.granted && isScanning) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Acesso à câmera negado.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Permitir Câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />

      {isScanning && (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      )}

      {isScanning && (
        <View
          style={[StyleSheet.absoluteFill, styles.overlayContainer]}
          pointerEvents="none"
        >
          <View style={styles.maskSide} />
          <View style={styles.focusRow}>
            <View style={styles.maskSide} />
            <View style={styles.focusedTarget}>
              <Animated.View
                style={[
                  styles.scanLine,
                  { transform: [{ translateY: scanLineAnim }] },
                ]}
              />
            </View>
            <View style={styles.maskSide} />
          </View>
          <View style={styles.maskSide} />
        </View>
      )}

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 60 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.mainInstruction}>
            {isScanning ? "ANALISANDO MEDIDOR" : "LEITURA INTELIGENTE"}
          </Text>
          <Text style={styles.subInstruction}>
            {isScanning
              ? "Mantenha o celular estável para a IA ler"
              : "Use nossa IA para ler seu consumo automaticamente"}
          </Text>
        </View>

        {!isScanning && (
          <View style={styles.iconCircle}>
            <Ionicons name="scan-outline" size={60} color="#0057ff" />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonActive]}
          activeOpacity={0.8}
          onPress={() => setIsScanning(!isScanning)}
        >
          <Text
            style={[styles.buttonText, isScanning && styles.buttonTextActive]}
          >
            {isScanning ? "CANCELAR" : "APONTAR CÂMERA"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000814",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  mainInstruction: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subInstruction: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#fff",
    width: width * 0.8,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextActive: {
    color: "#fff",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  maskSide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  focusRow: {
    flexDirection: "row",
    height: 200,
  },
  focusedTarget: {
    width: width * 0.8,
    height: 200,
    borderWidth: 2,
    borderColor: "#0057ff",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  scanLine: {
    height: 3,
    width: "100%",
    backgroundColor: "#0057ff",
    shadowColor: "#0057ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 100,
  },
});
