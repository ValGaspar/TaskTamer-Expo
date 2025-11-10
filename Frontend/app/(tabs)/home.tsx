import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { CircularProgress } from '@/components/CircularProgress';
import { TaskDetailPopUp } from '@/components/TaskDetailPopUp';
import { TaskItem } from '@/components/TaskItem';
import { TaskWarningPopUp } from '@/components/TaskWarningPopUp';
import { useFocusEffect } from '@react-navigation/native';
import { ProgressContext, Task as ProgressTask } from '@/components/ProgressContext';
import { list, create, update, destroy } from '@/services/taskService';
import { scheduleDayNotifications } from '@/utils/notifications';

import { Task, TaskPayload } from '@/services/types';


// const STORAGE_KEY = (userId: string) => `@tasks_${userId}`;

export default function HomeScreen() {
  // const { recalcProgress } = useContext(ProgressContext);

  const [tasks, setTasks] = useState<Task[]>([]);
  // const [userId, setUserId] = useState<string>('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const PRIORITY_ORDER = ['Prioridade Alta', 'Prioridade Média', 'Prioridade Baixa'];

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    console.log('loadData')
    const tasks = await list({})
    setTasks(tasks)

    // await recalcProgress(userTasks as ProgressTask[], savedUserId);
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setShowDetailModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => setShowDetailModal(false);

  const handleSubmitDetail = async (data: TaskPayload) => {
    if (editingTask) {
      await update(editingTask._id!, data)
    } else {
      const newTask: Task = {
        _id: 'temp',
        done: false,
        ...data,
        date: data.date || new Date(),
      };

      await create(newTask)

      if (tasks.length % 4 === 0) setShowWarningModal(true);
    }

    loadData()
    // await recalcProgress(updatedTasks as ProgressTask[], userId);
    setShowDetailModal(false);
  };

  const toggleDone = async (id: string) => {
    const currentTask = tasks.find((task) => task._id === id);
    await update(id, { done: !currentTask?.done })
    loadData()
    // await recalcProgress(updated as ProgressTask[], userId);
    // await scheduleDayNotifications(updated);
  };

  const handleDeleteTask = async (taskId: string) => {
    await destroy(taskId)
    loadData()
    // await recalcProgress(filtered as ProgressTask[], userId);
    // await scheduleDayNotifications(filtered);
    setShowDetailModal(false);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const aIndex = a.priority ? PRIORITY_ORDER.indexOf(a.priority) : PRIORITY_ORDER.length;
    const bIndex = b.priority ? PRIORITY_ORDER.indexOf(b.priority) : PRIORITY_ORDER.length;
    return aIndex - bIndex;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <ThemedView style={[styles.stepContainer, { paddingBottom: 85 }]}>
      <ThemedView style={styles.Container}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress fill={progressPercent} />
        </View>

        <ThemedView style={styles.todayBox}>
          <Button title="<" onPress={() => {alert('teste')}}/>
          <Text style={styles.todayText}>Hoje</Text>
          <Button title=">" />
        </ThemedView>

        <View style={styles.listContainer}>
          {!showDetailModal &&
            (tasks.length === 0 ? (
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  marginTop: 60,
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                Lista vazia
              </Text>
            ) : (
              <FlatList
                data={sortedTasks}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TaskItem
                    done={item.done ?? false}
                    title={`${item.title} (${item._id})`}
                    onToggle={() => toggleDone(item._id)}
                    onPress={() => openEditTaskModal(item)}
                  />
                )}
                showsVerticalScrollIndicator
              />
            ))}
        </View>

        <TaskWarningPopUp
          visible={showWarningModal}
          onClose={() => setShowWarningModal(false)}
        />

        <TouchableOpacity style={styles.newTaskButton} onPress={openNewTaskModal}>
          <Image
            source={require('@/assets/images/maisIcon.png')}
            style={styles.iconLeft}
          />
          <Text style={[styles.newTaskText, { fontFamily: 'Poppins-Regular' }]}>
            Novo afazer
          </Text>
        </TouchableOpacity>

        <TaskDetailPopUp
          visible={showDetailModal}
          onClose={closeDetailModal}
          onSubmit={handleSubmitDetail}
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
            editingTask ? () => handleDeleteTask(editingTask._id) : undefined
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
    paddingHorizontal: 40,
    paddingTop: 35,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  todayBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 35,
    minWidth: 260,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  todayText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newTaskButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 210,
  },
  iconLeft: {
    width: 24,
    height: 24,
    marginRight: 15,
    resizeMode: 'contain',
  },
  newTaskText: {
    color: 'white',
    fontSize: 18,
    textAlignVertical: 'center',
  },
});
