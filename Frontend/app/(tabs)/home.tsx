import React, { useState } from 'react';
import { StyleSheet, Dimensions, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useFonts } from 'expo-font';
import { Limelight_400Regular } from '@expo-google-fonts/limelight';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { ListRenderItem } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { CircularProgress } from '@/components/CircularProgress';
import { TaskDetailPopUp } from '@/components/TaskDetailPopUp';

const { width } = Dimensions.get('window');

type Task = {
  id: string;
  title: string;
  description?: string;
  date?: Date;
  priority?: string;
  type: 'tarefa';
};

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Limelight_400Regular,
    LibreBaskerville_400Regular,
    Poppins_400Regular,
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Tarefa 1', type: 'tarefa' },
    { id: '2', title: 'Tarefa 2', type: 'tarefa' },
    { id: '3', title: 'Tarefa 3', type: 'tarefa' },
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);

  const openDetailModal = () => setShowDetailModal(true);
  const closeDetailModal = () => setShowDetailModal(false);

  const handleSubmitDetail = (data: { title: string; description: string; date: Date; priority: string }) => {
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title: data.title,
      description: data.description,
      date: data.date,
      priority: data.priority,
      type: 'tarefa',
    };
    setTasks(prev => [...prev, newTask]);
    closeDetailModal();
  };

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <ThemedView style={styles.item}>
      <Checkbox style={styles.checkbox} />
      <View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedView style={styles.Container}>
        <CircularProgress fill={80} />

        <ThemedView style={styles.todayBox}>
          <Text style={styles.todayText}>Hoje</Text>
        </ThemedView>

        <View style={styles.listContainer}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={true}
          />
        </View>

        <TouchableOpacity style={styles.newTaskButton} onPress={openDetailModal}>
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
  title: {
    fontSize: 18,
    padding: 10,
    color: 'white',
  },
  item: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    borderColor: 'black',
    marginRight: 15,
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
