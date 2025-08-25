import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CircularProgress } from '@/components/CircularProgress';

type Task = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  done: boolean;
  userId: string;
};

const STORAGE_KEY = (userId: string) => `@tasks_${userId}`;

export default function TasksScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadUser = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) setUserId(storedUserId);
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        if (!userId) return;
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY(userId));
        setTasks(jsonValue ? JSON.parse(jsonValue) : []);
      };
      loadTasks();
    }, [userId])
  );

  useEffect(() => {
    if (!userId) return;
    AsyncStorage.setItem(STORAGE_KEY(userId), JSON.stringify(tasks));
  }, [tasks, userId]);

  const toggleDone = (taskId: string) => setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t));

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'Alta': return '#D86565';
      case 'Média': return '#DAE031';
      case 'Baixa': return '#91D865';
      default: return '#ccc';
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const completed = tasks.filter(t => t.done).length;
  const remaining = tasks.length - completed;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#516953" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarefas</Text>
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

      <FlatList
        data={tasks.sort((a, b) => ({ Alta: 1, 'Média': 2, Baixa: 3 }[a.priority] - { Alta: 1, 'Média': 2, Baixa: 3 }[b.priority]))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.taskCard, { borderLeftColor: getPriorityColor(item.priority) }]} onPress={() => toggleDone(item.id)}>
            <View style={styles.taskHeader}>
              <Text style={[styles.priority, { color: getPriorityColor(item.priority) }]}>Prioridade {item.priority}</Text>
              <Text style={styles.deadline}>Prazo: {formatDate(item.date || new Date().toISOString())}</Text>
            </View>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.status}>{item.done ? 'Concluída' : 'Pendente'}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma tarefa cadastrada</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 35 },
  headerTitle: { fontSize: 22, color: '#516953', fontFamily: 'Poppins_500Medium', marginLeft: 10 },
  progressCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#98B88F', padding: 16, borderRadius: 16, marginBottom: 20, elevation: 2 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, marginBottom: 5, fontFamily: 'Poppins_500Medium' },
  statLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular' },
  taskCard: { backgroundColor: '#fff', padding: 16, marginBottom: 15, borderRadius: 12, borderLeftWidth: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priority: { fontFamily: 'Poppins_500Medium', fontSize: 12 },
  deadline: { fontSize: 12, color: '#000' },
  taskTitle: { fontSize: 16, fontFamily: 'Poppins_400Regular' },
  status: { fontSize: 12, fontFamily: 'Poppins_400Regular', marginTop: 4, color: '#516953' },
});
