import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { watts, valor } = useLocalSearchParams<{ watts: string; valor: string }>();

  // Data formatada para hoje
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      {/* Header com Botão Fechar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resumo da Leitura</Text>
        <TouchableOpacity 
          onPress={() => router.replace("/(tabs)")} 
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color="#f2f2f2" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Principal */}
        <View style={styles.card}>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={60} color="#00C853" />
            <Text style={styles.successText}>Leitura Processada</Text>
          </View>

          <Text style={styles.label}>Valor da Fatura</Text>
          <Text style={styles.price}>R$ {valor}</Text>
          
          <View style={styles.divider} />

          {/* Info Adicional: Data */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoText}>Data da leitura: {dataHoje}</Text>
          </View>

          {/* Info Detalhada */}
          <View style={styles.detailsBox}>
            <View style={styles.row}>
              <Text style={styles.detailLabel}>Consumo Mensal</Text>
              <Text style={styles.detailValue}>{watts} kWh</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.detailLabel}>Tarifa</Text>
              <Text style={styles.detailValue}>R$ 0,92/kWh</Text>
            </View>
          </View>

          {/* Nota Fiscal Info */}
          <View style={styles.emailNotice}>
            <Ionicons name="mail-outline" size={18} color="#0057ff" />
            <Text style={styles.emailNoticeText}>
              A nota fiscal detalhada será enviada para o seu e-mail cadastrado.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer com Botões de Pagamento */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.pixButton} activeOpacity={0.7}>
          <Ionicons name="qr-code-outline" size={20} color="#fff" />
          <Text style={styles.pixButtonText}>PAGAR COM PIX</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boletoButton} activeOpacity={0.7}>
          <Ionicons name="barcode-outline" size={20} color="#0057ff" />
          <Text style={styles.boletoButtonText}>GERAR BOLETO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000814" // Fundo escuro profundo condizente com a ScanScreen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFFFFF' 
  },
  closeButton: { 
    padding: 5 
  },
  scrollContent: { 
    padding: 20 
  },
  card: {
    backgroundColor: '#0A1128', // Azul marinho muito escuro para o card
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B', // Borda sutil para dar profundidade
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  successBadge: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  successText: { 
    fontSize: 14, 
    color: '#00E676', // Verde levemente mais brilhante para o Dark Mode
    fontWeight: '600', 
    marginTop: 5 
  },
  label: { 
    fontSize: 14, 
    color: '#94A3B8', // Cinza azulado para labels
    textAlign: 'center' 
  },
  price: { 
    fontSize: 38, 
    fontWeight: '800', 
    color: '#FFFFFF', 
    textAlign: 'center', 
    marginVertical: 8 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#1E293B', 
    marginVertical: 20 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  infoText: { 
    marginLeft: 8, 
    color: '#94A3B8', 
    fontSize: 14 
  },
  detailsBox: { 
    backgroundColor: '#111B33', // Levemente mais claro que o card para contraste interno
    borderRadius: 16, 
    padding: 16 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },
  detailLabel: { 
    color: '#94A3B8', 
    fontSize: 14 
  },
  detailValue: { 
    fontWeight: '700', 
    fontSize: 14, 
    color: '#F1F5F9' 
  },
  emailNotice: { 
    flexDirection: 'row', 
    marginTop: 20, 
    paddingHorizontal: 10, 
    alignItems: 'center' 
  },
  emailNoticeText: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 12, 
    color: '#38BDF8', // Azul celeste para destaque em fundo escuro
    lineHeight: 18 
  },
  footer: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    backgroundColor: '#000814', 
    borderTopWidth: 1, 
    borderTopColor: '#1E293B' 
  },
  pixButton: {
    backgroundColor: '#0057ff',
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pixButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14, 
    marginLeft: 10 
  },
  boletoButton: {
    backgroundColor: 'transparent', // Botão fantasma no Dark Mode fica mais elegante
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0057ff',
  },
  boletoButtonText: { 
    color: '#0057ff', 
    fontWeight: 'bold', 
    fontSize: 14, 
    marginLeft: 10 
  },
});