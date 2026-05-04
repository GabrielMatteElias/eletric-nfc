import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar />

      {/* Header Minimalista */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>G</Text>
          </View>
          <Text style={styles.welcomeText}>Olá, Gabriel</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Card de Monitoramento NFC (Consumo e Valor) */}
        <View style={styles.energyCard}>
          <View style={styles.energyHeader}>
            <View style={styles.energyIconTitle}>
              <Ionicons name="flash" size={20} color="#0057ff" />
              <Text style={styles.energyTitle}>ÚLTIMA LEITURA NFC</Text>
            </View>
            <Text style={styles.energyDate}>Hoje, 14:20</Text>
          </View>

          <View style={styles.energyGrid}>
            <View style={styles.energyInfoBox}>
              <Text style={styles.energyLabel}>Consumo</Text>
              <Text style={styles.energyValue}>12.5 <Text style={styles.energyUnit}>kWh</Text></Text>
            </View>
            <View style={[styles.energyInfoBox, styles.borderLeft]}>
              <Text style={styles.energyLabel}>Valor Est.</Text>
              <Text style={styles.energyPrice}>R$ 11,20</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.energyFullDetailBtn} activeOpacity={0.7}>
            <Text style={styles.energyFullDetailText}>Ver análise detalhada</Text>
            <Ionicons name="arrow-forward" size={16} color="#0057ff" />
          </TouchableOpacity>
        </View>

        {/* Gestão de Cartões */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meus Cartões</Text>
          <TouchableOpacity>
            <Text style={styles.manageText}>Gerenciar</Text>
          </TouchableOpacity>
        </View>

        {/* Cartão existente primeiro */}
        <View style={styles.cardManagerItem}>
          <View style={styles.cardTypeIcon}>
            <Ionicons name="card-outline" size={24} color="#fff" />
          </View>
          <View style={styles.cardManagerInfo}>
            <Text style={styles.cardManagerName}>Visa Platinum</Text>
            <Text style={styles.cardManagerStatus}>Final 4832 • Virtual disponível</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#333" />
        </View>

        {/* Depois botão de adicionar */}
        <TouchableOpacity style={styles.addCardBtn} activeOpacity={0.8}>
          <View style={styles.addCardIcon}>
            <Ionicons name="add" size={24} color="#0057ff" />
          </View>
          <View>
            <Text style={styles.addCardTitle}>Adicionar novo cartão</Text>
            <Text style={styles.addCardSub}>Crédito ou Débito</Text>
          </View>
        </TouchableOpacity>

        {/* Atalhos de Conta */}
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.accountActions}>
          <SmallActionItem icon="receipt-outline" label="Extrato" />
          <SmallActionItem icon="key-outline" label="Pix" />
          <SmallActionItem icon="shield-outline" label="Segurança" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function SmallActionItem({ icon, label }: { icon: any, label: string }) {
  return (
    <TouchableOpacity style={styles.smallAction}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.smallActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000814' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0057ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  welcomeText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 10 },
  iconBtn: { padding: 8, backgroundColor: '#00122e', borderRadius: 12 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // Card NFC Profissional
  energyCard: {
    backgroundColor: '#00122e',
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    elevation: 4,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  energyIconTitle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  energyTitle: { color: '#0057ff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  energyDate: { color: '#666', fontSize: 12 },
  energyGrid: { flexDirection: 'row', marginBottom: 20 },
  energyInfoBox: { flex: 1 },
  borderLeft: { borderLeftWidth: 1, borderLeftColor: '#1a2a44', paddingLeft: 20 },
  energyLabel: { color: '#999', fontSize: 12, marginBottom: 4 },
  energyValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  energyUnit: { fontSize: 14, color: '#0057ff' },
  energyPrice: { color: '#2ecc71', fontSize: 24, fontWeight: 'bold' },
  energyFullDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#1a2a44',
  },
  energyFullDetailText: { color: '#0057ff', fontWeight: '600', fontSize: 14 },

  // Gestão de Cartões
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  manageText: { color: '#0057ff', fontWeight: '600' },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00122e',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#0057ff',
  },
  addCardIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 87, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addCardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  addCardSub: { color: '#666', fontSize: 12 },
  cardManagerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00122e',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  cardTypeIcon: { width: 40, height: 40, justifyContent: 'center' },
  cardManagerInfo: { flex: 1, marginLeft: 10 },
  cardManagerName: { color: '#fff', fontWeight: '600' },
  cardManagerStatus: { color: '#666', fontSize: 12 },

  // Atalhos Conta
  accountActions: { flexDirection: 'row', gap: 12 },
  smallAction: {
    flex: 1,
    backgroundColor: '#00122e',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  smallActionLabel: { color: '#fff', fontSize: 12, fontWeight: '500' },
});