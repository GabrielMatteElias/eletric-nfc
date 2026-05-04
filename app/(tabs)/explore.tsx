import React from 'react';
import { StyleSheet, SectionList, TouchableOpacity, StatusBar } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAYMENTS_HISTORY = [
  {
    month: 'Maio 2026',
    data: [
      { id: '1', title: 'Fatura', date: '02 Mai', price: 'R$ 185,40', status: 'Pago' },
      { id: '2', title: 'Taxa de Manutenção', date: '01 Mai', price: 'R$ 12,90', status: 'Pago' },
      { id: '15', title: 'Fatura (Atrasada)', date: '10 Mai', price: 'R$ 198,22', status: 'Pago com Juros' },
    ],
  },
  {
    month: 'Abril 2026',
    data: [
      { id: '3', title: 'Fatura', date: '05 Abr', price: 'R$ 210,15', status: 'Pago' },
      { id: '16', title: 'Fatura (Atrasada)', date: '12 Abr', price: 'R$ 225,90', status: 'Pago com Juros' },
    ],
  },
  {
    month: 'Março 2026',
    data: [
      { id: '4', title: 'Fatura', date: '03 Mar', price: 'R$ 199,99', status: 'Pago' },
      { id: '5', title: 'Taxa de Manutenção', date: '01 Mar', price: 'R$ 12,90', status: 'Pago' },
    ],
  },
  {
    month: 'Fevereiro 2026',
    data: [
      { id: '6', title: 'Fatura', date: '04 Fev', price: 'R$ 175,30', status: 'Pago' },
    ],
  },
  {
    month: 'Janeiro 2026',
    data: [
      { id: '7', title: 'Fatura', date: '06 Jan', price: 'R$ 220,00', status: 'Pago' },
    ],
  },
  {
    month: 'Dezembro 2025',
    data: [
      { id: '9', title: 'Fatura', date: '05 Dez', price: 'R$ 205,75', status: 'Pago' },
    ],
  },
  {
    month: 'Novembro 2025',
    data: [
      { id: '10', title: 'Fatura', date: '04 Nov', price: 'R$ 198,60', status: 'Pago' },
      { id: '11', title: 'Taxa de Manutenção', date: '01 Nov', price: 'R$ 12,90', status: 'Pago' },
    ],
  },
  {
    month: 'Outubro 2025',
    data: [
      { id: '12', title: 'Fatura', date: '03 Out', price: 'R$ 187,45', status: 'Pago' },
      { id: '19', title: 'Fatura (Atrasada)', date: '18 Out', price: 'R$ 205,00', status: 'Pago com Juros' },
    ],
  },
  {
    month: 'Setembro 2025',
    data: [
      { id: '13', title: 'Fatura', date: '05 Set', price: 'R$ 176,80', status: 'Pago' },
    ],
  },
  {
    month: 'Agosto 2025',
    data: [
      { id: '14', title: 'Fatura', date: '06 Ago', price: 'R$ 169,90', status: 'Pago' },
      { id: '20', title: 'Fatura (Atrasada)', date: '22 Ago', price: 'R$ 188,70', status: 'Pago com Juros' },
    ],
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons name="receipt-outline" size={22} color="#27ae60" />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.mainRow}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>

        <View style={styles.subRow}>
          <Text style={styles.itemSubtitle}>{item.date}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <Text style={styles.title}>Pagamentos</Text>
      </View>

      <SectionList
        sections={PAYMENTS_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { month } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{month}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#999',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#FF4D4D',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0057ff',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#00122e', // Azul marinho muito escuro para destacar do fundo
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  statusBadge: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2ecc71',
    textTransform: 'uppercase',
  },
});