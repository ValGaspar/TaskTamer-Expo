import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CircularProgress } from '@/components/CircularProgress';

type Task = {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  done: boolean;
  userId: string;
};

export default function TasksScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  const API_URL = 'https://tasktamer-expo.onrender.com/tasks';

  // Pega o usuário logado
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error('Erro ao pegar userId:', error);
      }
    };
    loadUser();
  }, []);

  // Busca tarefas do usuário
  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        const data = await response.json();
        if (Array.isArray(data)) setTasks(data);
        else setTasks([]);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        Alert.alert('Erro', 'Não foi possível carregar suas tarefas.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // Atualiza status da tarefa
  const toggleDone = async (taskId: string, done: boolean) => {
    try {
      await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done }),
      });
      setTasks(prev =>
        prev.map(t => (t._id === taskId ? { ...t, done: !done } : t))
      );
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  // Cores por prioridade
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'Alta':
        return '#D86565';
      case 'Média':
        return '#DAE031';
      case 'Baixa':
        return '#91D865';
      default:
        return '#ccc';
    }
  };

  const completed = tasks.filter(t => t.done).length;
  const remaining = tasks.length - completed;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  const renderTask = ({ item }: { item: Task }) => {
    const color = getPriorityColor(item.priority);
    const deadline = item.deadline ? item.deadline : 'Sem prazo';
    const statusText = item.done ? 'Concluída' : 'Pendente';

    return (
      <TouchableOpacity
        style={[styles.taskCard, { borderLeftColor: color }]}
        onPress={() => toggleDone(item._id, item.done)}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.priority, { color }]}>
            Prioridade {item.priority}
          </Text>
          <Text style={styles.deadline}>{deadline}</Text>
        </View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.status}>{statusText}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#516953" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#516953" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarefas</Text>
      </View>

      {/* Progresso */}
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

      {/* Lista */}
      <FlatList
        data={tasks.sort((a, b) => {
          const order: Record<string, number> = { Alta: 1, 'Média': 2, Baixa: 3 };
          return (order[a.priority] || 4) - (order[b.priority] || 4);
        })}
        keyExtractor={item => item._id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhuma tarefa cadastrada
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 35 },
  headerTitle: { fontSize: 22, marginLeft: 10, color: '#516953', fontFamily: 'Poppins_600SemiBold' },
  progressCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#98B88F', padding: 16, borderRadius: 16, marginBottom: 20, elevation: 2 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 20, marginBottom: 5, fontFamily: 'Poppins_500Medium' },
  statLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular' },
  list: { paddingBottom: 20 },
  taskCard: { backgroundColor: '#fff', padding: 16, marginBottom: 15, borderRadius: 12, borderLeftWidth: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priority: { fontFamily: 'Poppins_500Medium', fontSize: 12 },
  deadline: { fontSize: 12, color: '#000' },
  taskTitle: { fontSize: 16, fontFamily: 'Poppins_400Regular' },
  status: { marginTop: 4, fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#516953' },
});
