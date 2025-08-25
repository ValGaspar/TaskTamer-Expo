// screens/TasksScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CircularProgress } from "@/components/CircularProgress";

type Task = {
  id: string;
  title: string;
  description?: string;
  deadline?: string; // ISO string
  priority?: "Alta" | "Média" | "Baixa";
  done: boolean;
  userId: string;
};

const STORAGE_KEY = (userId: string) => `@tasks_${userId}`;

export default function TasksScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string>("");

  // Pega usuário logado
  useEffect(() => {
    const loadUser = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) setUserId(storedUserId);
    };
    loadUser();
  }, []);

  // Carrega tarefas do usuário
  useEffect(() => {
    if (!userId) return;
    const loadTasks = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY(userId));
        const parsedTasks: Task[] = jsonValue ? JSON.parse(jsonValue) : [];
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        setTasks([]);
      }
    };
    loadTasks();
  }, [userId]);

  // Salva tarefas sempre que mudarem
  useEffect(() => {
    if (!userId) return;
    AsyncStorage.setItem(STORAGE_KEY(userId), JSON.stringify(tasks));
  }, [tasks, userId]);

  // Estatísticas
  const completed = tasks.filter((t) => t.done).length;
  const remaining = tasks.length - completed;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  const getPriorityColor = (priority?: Task["priority"]) => {
    switch (priority) {
      case "Alta":
        return "#D86565";
      case "Média":
        return "#DAE031";
      case "Baixa":
        return "#91D865";
      default:
        return "#ccc";
    }
  };

  const toggleDone = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return "Sem prazo";
    const date = new Date(deadline);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const renderTask = ({ item }: { item: Task }) => {
    const color = getPriorityColor(item.priority);
    return (
      <TouchableOpacity
        style={[styles.taskCard, { borderLeftColor: color }]}
        onPress={() => toggleDone(item.id)}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.priority, { color }]}>
             {item.priority || "Sem"}
          </Text>
          <Text style={styles.deadline}>{formatDeadline(item.deadline)}</Text>
        </View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
        <Text style={styles.status}>{item.done ? "Concluída" : "Pendente"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.getParent()?.navigate("categorias")}
        >
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

      {/* Lista de tarefas */}
      <FlatList
        data={tasks.sort((a, b) => {
          const order: Record<string, number> = { Alta: 1, "Média": 2, Baixa: 3 };
          return (order[a.priority || ""] || 4) - (order[b.priority || ""] || 4);
        })}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhuma tarefa cadastrada
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  headerTitle: {
    fontSize: 22,
    marginLeft: 10,
    color: "#516953",
    fontFamily: "Poppins_600SemiBold",
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#98B88F",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 20, marginBottom: 5, fontFamily: "Poppins_500Medium" },
  statLabel: { fontSize: 14, fontFamily: "Poppins_400Regular" },
  list: { paddingBottom: 20 },
  taskCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  taskHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  priority: { fontFamily: "Poppins_500Medium", fontSize: 12 },
  deadline: { fontSize: 12, color: "#000" },
  taskTitle: { fontSize: 16, fontFamily: "Poppins_400Regular" },
  description: { fontSize: 14, fontFamily: "Poppins_400Regular", marginTop: 4 },
  status: { fontSize: 12, fontFamily: "Poppins_400Regular", marginTop: 4, color: "#516953" },
});
