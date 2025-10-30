import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RelatorioScreen() {
  const navigation = useNavigation();

  const completed = 3;
  const remaining = 2;
  const progress = 60;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#516953" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório de Atividades</Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{remaining}</Text>
          <Text style={styles.statLabel}>Restantes</Text>
        </View>

        <CircularProgress size={90} fill={progress} />

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completed}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>
      </View>

      <Text style={styles.note}>Aqui um rascunho visual do card de progresso tanto de tarefas concluídas quanto não.</Text>
      <Text style={styles.note}>Card de resumo (se 0 tarefas texto motivacional, se média então um ok! se tudo só glória).</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 35, marginVertical: 30 },
  headerTitle: { fontSize: 22, color: '#516953', fontFamily: 'Poppins_500Medium', marginLeft: 10 },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#98B88F',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, marginBottom: 5, fontFamily: 'Poppins_500Medium', color: 'black' },
  statLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: 'black' },
  note: { textAlign: 'center', marginTop: 20, color: '#555', fontFamily: 'Poppins_400Regular' },
});
