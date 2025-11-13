import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ProgressCard } from "@/components/ProgressCard";
import ConcluidasIcon from "@/assets/images/progressIcon.png";
import PendentesIcon from "@/assets/images/progressIconRed.png";
import { BarChart } from "react-native-chart-kit";
import { getStatistics } from '@/services/taskService';

const screenWidth = Dimensions.get("window").width;

export default function RelatorioScreen() {
  const navigation = useNavigation();

  const [weeklyCounts, setWeeklyCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [completed, setCompleted] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const statistics = await getStatistics()
    let done = 0
    const counts = [0, 0, 0, 0, 0, 0, 0];
    statistics.graph.forEach((day: any) => {
      const currentDay = new Date(day._id).getDay()
      counts[currentDay] += day.count
      done += day.count
    })
    setWeeklyCounts(counts);
    setCompleted(done)
    setRemaining(statistics.pending)
    setPercentage(Math.round((done / (done + statistics.pending)) * 100))
  };

  const totalWeek = weeklyCounts.reduce((a, b) => a + b, 0);

  const summaryMessage =
    totalWeek === 0
      ? "Você ainda não concluiu nenhuma tarefa. Que tal começar por algo simples hoje? 💪"
      : percentage < 100
        ? "Você está no caminho certo! Continue dedicando um tempinho por dia. 🌱"
        : "Parabéns! Todas as tarefas foram concluídas com sucesso. 🎉"

  const weeklyData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [{ data: weeklyCounts }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(81, 105, 83, ${opacity})`,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: () => "#000",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#516953" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatório de Atividades</Text>
      </View>

      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Gráfico Semanal</Text>
        <Text style={styles.chartSubtitle}>Tarefas concluídas por dia</Text>
      </View>

      <BarChart
        data={weeklyData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars={true}
        yAxisLabel=""
        yAxisSuffix=" tarefas"
        style={{ borderRadius: 16, marginBottom: 20 }}
      />

      <View style={styles.cardsRow}>
        <ProgressCard
          title="Concluídas"
          percentage={percentage}
          icon={ConcluidasIcon}
          taskCount={completed}
        />
        <ProgressCard
          title="Pendentes"
          percentage={100 - percentage}
          icon={PendentesIcon}
          taskCount={remaining}
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumo</Text>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryText}>{summaryMessage}</Text>
        </View>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
    marginVertical: 30,
  },
  headerTitle: {
    fontSize: 22,
    color: "#516953",
    fontFamily: "Poppins_500Medium",
    marginLeft: 10,
  },
  chartHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
  },
  chartSubtitle: {
    fontSize: 13,
    color: "#516953",
    fontFamily: "Poppins_400Regular",
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#98B88F",
    borderRadius: 10,
    marginTop: 25,
    overflow: "hidden",
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    backgroundColor: "#98B88F",
    color: "#000",
    width: "100%",
    textAlign: "center",
    paddingVertical: 10,
  },
  summaryContent: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#000",
    textAlign: "center",
  },
});
