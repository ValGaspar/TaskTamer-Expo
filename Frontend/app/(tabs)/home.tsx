import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
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
};

const STORAGE_KEY = '@tasks_storage';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          const loadedTasks: Task[] = JSON.parse(jsonValue);
          const parsedTasks = loadedTasks.map(t => ({
            ...t,
            date: t.date ? new Date(t.date) : undefined,
          }));
          setTasks(parsedTasks);
        }
      } catch (e) {
        console.error('Erro ao carregar tarefas:', e);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        const jsonValue = JSON.stringify(tasks);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      } catch (e) {
        console.error('Erro ao salvar tarefas:', e);
      }
    };
    saveTasks();
  }, [tasks]);

  const openNewTaskModal = () => {
    setEditingTask(null);
    setShowDetailModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => setShowDetailModal(false);

  const handleSubmitDetail = (data: {
    title: string;
    description: string;
    date: Date;
    priority: string;
  }) => {
    if (editingTask) {
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === editingTask.id ? { ...t, ...data } : t
        )
      );
    } else {
      const newTask: Task = {
        id: (tasks.length + 1).toString(),
        type: 'tarefa',
        done: false,
        ...data,
      };
      setTasks(prev => [...prev, newTask]);
    }
    setShowDetailModal(false);
  };

  const toggleDone = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
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
          {!showDetailModal && (tasks.length === 0 ? (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50, fontSize: 16 }}>
              Lista vazia
            </Text>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={true}
            />
          ))}
        </View>


        <TouchableOpacity style={styles.newTaskButton} onPress={openNewTaskModal}>
          <>
            <Image source={require('@/assets/images/maisIcon.png')} style={styles.iconLeft} />
            <Text style={styles.newTaskText}>Novo afazer</Text>
          </>
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
