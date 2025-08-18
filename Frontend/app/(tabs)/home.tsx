import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Limelight_400Regular } from '@expo-google-fonts/limelight';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { ListRenderItem } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { CircularProgress } from '@/components/CircularProgress';
import { TaskDetailPopUp } from '@/components/TaskDetailPopUp';
import { TaskItem } from '@/components/TaskItem';

const { width } = Dimensions.get('window');

type Task = {
  id: string;
  title: string;
  description?: string;
  date?: Date;
  priority?: string;
  done?: boolean;
  type: 'tarefa';
  userId: string;
};

// Função que gera a chave de storage de acordo com o usuário
const STORAGE_KEY = (userId: string) => `@tasks_${userId}`;

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userId, setUserId] = useState<string>(''); // usuário logado

  const PRIORITY_ORDER = ['Prioridade Alta', 'Prioridade Média', 'Prioridade Baixa'];

  // Carrega ID do usuário e as tarefas específicas dele
  useEffect(() => {
    const loadData = async () => {
      const savedUserId = await AsyncStorage.getItem('userId');
      if (!savedUserId) {
        console.warn('Nenhum usuário encontrado no AsyncStorage!');
        return;
      }

      setUserId(savedUserId);

      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY(savedUserId));
      const userTasks: Task[] = jsonValue
        ? JSON.parse(jsonValue).map((t: Task) => ({
            ...t,
            date: t.date ? new Date(t.date) : undefined,
          }))
        : [];

      setTasks(userTasks);
    };
    loadData();
  }, []);

  // Salva tarefas no storage do usuário atual
  useEffect(() => {
    const saveTasks = async () => {
      if (!userId) return;
      await AsyncStorage.setItem(STORAGE_KEY(userId), JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks, userId]);

  const openNewTaskModal = () => {
    if (!userId) {
      console.warn('Usuário ainda não carregado!');
      return;
    }
    setEditingTask(null);
    setShowDetailModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => setShowDetailModal(false);

  const handleSubmitDetail = (data: { title: string; description: string; date: Date; priority: string }) => {
    if (!userId) {
      console.warn('Usuário não definido ao salvar tarefa!');
      return;
    }

    const priorityValue = data.priority || 'Prioridade Alta';

    if (editingTask) {
      setTasks(prev =>
        prev.map(t => (t.id === editingTask.id ? { ...t, ...data, priority: priorityValue } : t)),
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        type: 'tarefa',
        done: false,
        userId,
        ...data,
        priority: priorityValue,
      };
      setTasks(prev => [...prev, newTask]);
    }

    setShowDetailModal(false);
  };

  const toggleDone = (id: string) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <TaskItem
      done={item.done ?? false}
      title={item.title}
      onToggle={() => toggleDone(item.id)}
      onPress={() => openEditTaskModal(item)}
    />
  );

  if (!fontsLoaded) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.done).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Ordenando tarefas 
  const sortedTasks = [...tasks].sort((a, b) => {
    const aIndex = a.priority ? PRIORITY_ORDER.indexOf(a.priority) : PRIORITY_ORDER.length;
    const bIndex = b.priority ? PRIORITY_ORDER.indexOf(b.priority) : PRIORITY_ORDER.length;
    return aIndex - bIndex;
  });

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedView style={styles.Container}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress fill={progressPercent} />
        </View>

        <ThemedView style={styles.todayBox}>
          <Text style={styles.todayText}>Hoje</Text>
        </ThemedView>

        <View style={styles.listContainer}>
          {!showDetailModal &&
            (tasks.length === 0 ? (
              <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50, fontSize: 16 }}>
                Lista vazia
              </Text>
            ) : (
              <FlatList
                data={sortedTasks}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator
              />
            ))}
        </View>

        <TouchableOpacity style={styles.newTaskButton} onPress={openNewTaskModal}>
          <Image source={require('@/assets/images/maisIcon.png')} style={styles.iconLeft} />
          <Text style={styles.newTaskText}>Novo afazer</Text>
        </TouchableOpacity>

        <TaskDetailPopUp
          visible={showDetailModal}
          onClose={closeDetailModal}
          onSubmit={handleSubmitDetail}
          type="tarefa"
          initialData={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description || '',
                  date: editingTask.date || new Date(),
                  priority: editingTask.priority || 'Prioridade Alta',
                }
              : null
          }
          onDelete={
            editingTask
              ? () => {
                  setTasks(prev => prev.filter(t => t.id !== editingTask.id));
                  setShowDetailModal(false);
                }
              : undefined
          }
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  Container: {
    flex: 1,
    width: '100%',
    padding: 50,
  },
  todayBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 45,
    minWidth: 260,
    alignSelf: 'center',
  },
  todayText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'left',
  },
  listContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newTaskButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 12,
    minWidth: 220,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconLeft: {
    width: 38,
    height: 38,
    position: 'absolute',
    left: 10,
    resizeMode: 'contain',
  },
  newTaskText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
